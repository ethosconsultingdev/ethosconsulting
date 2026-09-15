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

export async function saveInquiry(
  input: InquiryInput,
  remoteIp?: string,
): Promise<StoredInquiry> {
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

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      subject: `Novo contacto ETHOS: ${input.name}`,
      text: buildTextEmail(record),
      html: buildHtmlEmail(record),
    }),
    signal: AbortSignal.timeout(10000),
  })

  if (!response.ok) {
    throw new Error('Não foi possível enviar. Tente novamente mais tarde.')
  }

  return record
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

function buildTextEmail(inquiry: StoredInquiry) {
  return [
    'Novo pedido de contacto através do website ETHOS',
    '',
    `Nome: ${inquiry.name}`,
    `E-mail: ${inquiry.email}`,
    `Organização: ${inquiry.organisation || 'Não indicada'}`,
    `Área: ${inquiry.area}`,
    `Recebido em: ${inquiry.receivedAt}`,
    '',
    'Mensagem:',
    inquiry.message,
  ].join('\n')
}

function buildHtmlEmail(inquiry: StoredInquiry) {
  const rows = [
    ['Nome', inquiry.name],
    ['E-mail', inquiry.email],
    ['Organização', inquiry.organisation || 'Não indicada'],
    ['Área', inquiry.area],
    ['Recebido em', inquiry.receivedAt],
  ]

  return `<h1>Novo pedido de contacto ETHOS</h1>
<table>${rows
    .map(
      ([label, value]) =>
        `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
    )
    .join('')}</table>
<h2>Mensagem</h2>
<p>${escapeHtml(inquiry.message).replace(/\n/g, '<br>')}</p>`
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
