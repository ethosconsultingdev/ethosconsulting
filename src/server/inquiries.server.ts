import type { InquiryInput } from './inquiries.schema'

export interface StoredInquiry {
  id: string
  receivedAt: string
  name: string
  email: string
  organisation?: string
  area: string
  message: string
}

interface EmailPayload {
  from: string
  to: string[]
  reply_to: string
  subject: string
  text: string
  html: string
  tags: Array<{ name: string; value: string }>
}

interface RateLimiter {
  limit: (options: { key: string }) => Promise<{ success: boolean }>
}

declare global {
  var __env__: { CONTACT_RATE_LIMITER?: RateLimiter } | undefined
}

const AREA_LABELS: Record<string, string> = {
  'procurement-estrategico': 'Procurement Estratégico',
  'auditoria-procurement': 'Auditoria de Procurement',
  'supply-chain': 'Supply Chain',
  'gestao-fornecedores': 'Gestão de Fornecedores',
  'esg-sustentabilidade': 'ESG e Sustentabilidade',
  'consultoria-estrategica': 'Consultoria Estratégica',
  outro: 'Outro',
}

export async function saveInquiry(
  input: InquiryInput,
  remoteIp?: string,
): Promise<StoredInquiry> {
  await enforceContactRateLimit(remoteIp)
  await verifyTurnstile(input.turnstileToken, remoteIp)

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL
  const to = process.env.CONTACT_TO_EMAIL

  if (!apiKey || !from || !to) {
    throw new Error(
      'O formulário ainda não está configurado. Tente novamente mais tarde.',
    )
  }

  const record: StoredInquiry = {
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    name: input.name,
    email: input.email,
    organisation: input.organisation,
    area: input.area,
    message: input.message,
  }

  const notification = await sendEmail(
    apiKey,
    {
      from,
      to: [to],
      reply_to: input.email,
      subject: `Novo contacto ETHOS: ${input.name}`,
      text: buildNotificationText(record),
      html: buildNotificationHtml(record),
      tags: [{ name: 'email_type', value: 'contact-notification' }],
    },
    `contact-notification/${record.id}`,
  )

  if (!notification.ok) {
    console.error(
      JSON.stringify({
        event: 'contact_notification_failed',
        inquiryId: record.id,
        status: notification.status,
      }),
    )
    throw new Error('Não foi possível enviar. Tente novamente mais tarde.')
  }

  const confirmation = await sendEmail(
    apiKey,
    {
      from,
      to: [input.email],
      reply_to: to,
      subject: 'Recebemos a sua mensagem | ETHOS CONSULTING',
      text: buildConfirmationText(record),
      html: buildConfirmationHtml(record),
      tags: [{ name: 'email_type', value: 'contact-confirmation' }],
    },
    `contact-confirmation/${record.id}`,
  )

  if (!confirmation.ok) {
    console.error(
      JSON.stringify({
        event: 'contact_confirmation_failed',
        inquiryId: record.id,
        status: confirmation.status,
      }),
    )
  }

  return record
}

async function enforceContactRateLimit(remoteIp?: string) {
  const limiter = globalThis.__env__?.CONTACT_RATE_LIMITER

  if (!limiter) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'O formulário ainda não está configurado. Tente novamente mais tarde.',
      )
    }
    return
  }

  if (!remoteIp) {
    throw new Error('Não foi possível enviar. Tente novamente mais tarde.')
  }

  const { success } = await limiter.limit({ key: `contact:${remoteIp}` })
  if (!success) {
    console.warn(JSON.stringify({ event: 'contact_rate_limited' }))
    throw new Error(
      'Foram feitas demasiadas tentativas. Aguarde um minuto e tente novamente.',
    )
  }
}

async function sendEmail(
  apiKey: string,
  payload: EmailPayload,
  idempotencyKey: string,
) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    })

    return { ok: response.ok, status: response.status }
  } catch {
    return { ok: false, status: null }
  }
}

async function verifyTurnstile(token: string, remoteIp?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES || '')
      .split(',')
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  )

  if (!secret || !token || token.length > 2048 || !expectedHostnames.size) {
    throw new Error('Confirme que não é um robô.')
  }

  let result: { success?: boolean; action?: string; hostname?: string }
  try {
    const body = new URLSearchParams({ secret, response: token })
    if (remoteIp) body.set('remoteip', remoteIp)

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: AbortSignal.timeout(10000),
      },
    )
    if (!response.ok) throw new Error(`Siteverify failed (${response.status})`)
    result = (await response.json()) as typeof result
  } catch {
    throw new Error('A verificação de segurança falhou. Tente novamente.')
  }

  if (
    !result.success ||
    result.action !== 'contact' ||
    !result.hostname ||
    !expectedHostnames.has(result.hostname)
  ) {
    throw new Error('A verificação de segurança falhou. Tente novamente.')
  }
}

function buildNotificationText(inquiry: StoredInquiry) {
  return [
    'Novo pedido de contacto através do website ETHOS',
    '',
    `Nome: ${inquiry.name}`,
    `E-mail: ${inquiry.email}`,
    `Organização: ${inquiry.organisation || 'Não indicada'}`,
    `Área: ${formatArea(inquiry.area)}`,
    `Recebido em: ${formatReceivedAt(inquiry.receivedAt)}`,
    `Referência: ${inquiry.id}`,
    '',
    'Mensagem:',
    inquiry.message,
    '',
    `Responder: ${inquiry.email}`,
  ].join('\n')
}

function buildNotificationHtml(inquiry: StoredInquiry) {
  const replySubject = encodeURIComponent(
    `Re: Pedido de contacto ETHOS ${inquiry.id}`,
  )

  return buildEmailLayout({
    preheader: `Novo contacto de ${inquiry.name} através do website ETHOS.`,
    eyebrow: 'Novo contacto',
    heading: 'Recebeu um novo pedido',
    introduction:
      'Um visitante submeteu o formulário do website. Os dados completos seguem abaixo.',
    content: `${buildDetailsTable([
      ['Nome', inquiry.name],
      ['E-mail', inquiry.email],
      ['Organização', inquiry.organisation || 'Não indicada'],
      ['Área de interesse', formatArea(inquiry.area)],
      ['Recebido em', formatReceivedAt(inquiry.receivedAt)],
    ])}
      ${buildMessageBlock('Mensagem', inquiry.message)}
      ${buildButton(
        `mailto:${inquiry.email}?subject=${replySubject}`,
        'Responder ao contacto',
      )}`,
    footer: `Referência do pedido: ${inquiry.id}`,
  })
}

function buildConfirmationText(inquiry: StoredInquiry) {
  return [
    `Olá, ${firstName(inquiry.name)}.`,
    '',
    'Obrigado por contactar a ETHOS CONSULTING.',
    'Recebemos a sua mensagem e a nossa equipa irá analisá-la. Respondemos normalmente no prazo de até 2 dias úteis.',
    '',
    'Resumo do seu pedido:',
    `Organização: ${inquiry.organisation || 'Não indicada'}`,
    `Área de interesse: ${formatArea(inquiry.area)}`,
    `Recebido em: ${formatReceivedAt(inquiry.receivedAt)}`,
    `Referência: ${inquiry.id}`,
    '',
    'Mensagem:',
    inquiry.message,
    '',
    'Se precisar de acrescentar alguma informação, responda diretamente a este e-mail.',
    '',
    'ETHOS CONSULTING',
    'Procurement · Supply Chain · Auditoria · ESG',
    'https://ethosconsultingmz.co.mz',
  ].join('\n')
}

function buildConfirmationHtml(inquiry: StoredInquiry) {
  return buildEmailLayout({
    preheader:
      'Recebemos a sua mensagem. A equipa ETHOS responderá em até 2 dias úteis.',
    eyebrow: 'Mensagem recebida',
    heading: `Obrigado, ${firstName(inquiry.name)}.`,
    introduction:
      'Recebemos a sua mensagem e a nossa equipa irá analisá-la. Respondemos normalmente no prazo de até 2 dias úteis.',
    content: `<h2 style="margin:32px 0 12px;color:#0a1b29;font-family:Arial,sans-serif;font-size:18px;line-height:1.4;">Resumo do seu pedido</h2>
      ${buildDetailsTable([
        ['Organização', inquiry.organisation || 'Não indicada'],
        ['Área de interesse', formatArea(inquiry.area)],
        ['Recebido em', formatReceivedAt(inquiry.receivedAt)],
      ])}
      ${buildMessageBlock('A sua mensagem', inquiry.message)}
      <p style="margin:24px 0 0;color:#475569;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;">Se precisar de acrescentar alguma informação, responda diretamente a este e-mail.</p>
      ${buildButton('https://ethosconsultingmz.co.mz', 'Visitar o website')}`,
    footer: `Referência do pedido: ${inquiry.id}`,
  })
}

function buildEmailLayout({
  preheader,
  eyebrow,
  heading,
  introduction,
  content,
  footer,
}: {
  preheader: string
  eyebrow: string
  heading: string
  introduction: string
  content: string
  footer: string
}) {
  return `<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:#eef2f3;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#eef2f3;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 30px rgba(22,40,46,0.08);">
          <tr>
            <td style="padding:26px 32px;background:#0a1b29;">
              <span style="color:#ffffff;font-family:Arial,sans-serif;font-size:24px;font-weight:800;letter-spacing:-0.5px;">ETHOS</span>
              <span style="margin-left:8px;color:#8decc0;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Consulting</span>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 32px;">
              <p style="margin:0 0 10px;color:#157f4d;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">${escapeHtml(eyebrow)}</p>
              <h1 style="margin:0;color:#0a1b29;font-family:Arial,sans-serif;font-size:28px;line-height:1.25;letter-spacing:-0.5px;">${escapeHtml(heading)}</h1>
              <p style="margin:16px 0 28px;color:#475569;font-family:Arial,sans-serif;font-size:16px;line-height:1.7;">${escapeHtml(introduction)}</p>
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:22px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#64748b;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;">${escapeHtml(footer)}</p>
              <p style="margin:5px 0 0;color:#64748b;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;">ETHOS CONSULTING · Maputo, Moçambique</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function buildDetailsTable(rows: Array<[string, string]>) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border:1px solid #dfe8e7;border-radius:10px;border-collapse:separate;overflow:hidden;">
    ${rows
      .map(
        ([label, value], index) => `<tr>
      <td style="width:34%;padding:12px 14px;${index ? 'border-top:1px solid #dfe8e7;' : ''}background:#f4f9f8;color:#47615e;font-family:Arial,sans-serif;font-size:13px;font-weight:700;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:12px 14px;${index ? 'border-top:1px solid #dfe8e7;' : ''}color:#1e293b;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>`,
      )
      .join('')}
  </table>`
}

function buildMessageBlock(label: string, message: string) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin-top:24px;background:#f8fafc;border-left:4px solid #157f4d;border-radius:0 8px 8px 0;">
    <tr>
      <td style="padding:20px;">
        <p style="margin:0 0 8px;color:#0a1b29;font-family:Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">${escapeHtml(label)}</p>
        <p style="margin:0;color:#334155;font-family:Arial,sans-serif;font-size:15px;line-height:1.7;">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      </td>
    </tr>
  </table>`
}

function buildButton(href: string, label: string) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:28px;">
    <tr>
      <td style="border-radius:7px;background:#157f4d;">
        <a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 21px;color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;">${escapeHtml(label)}</a>
      </td>
    </tr>
  </table>`
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || name
}

function formatArea(area: string) {
  return (
    AREA_LABELS[area] ||
    area
      .split('-')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  )
}

function formatReceivedAt(receivedAt: string) {
  return new Intl.DateTimeFormat('pt-MZ', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Africa/Maputo',
  }).format(new Date(receivedAt))
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      })[character] || character,
  )
}
