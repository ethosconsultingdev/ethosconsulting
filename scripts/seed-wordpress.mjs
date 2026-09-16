import { readFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'

const apiRoot = process.env.WORDPRESS_API_URL?.replace(/\/$/, '')
const username = process.env.WORDPRESS_API_USERNAME
const password = process.env.WORDPRESS_API_PASSWORD

if (!apiRoot || !username || !password) {
  throw new Error('WordPress API credentials are missing from .env')
}

const authorization = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
const projectRoot = process.cwd()

function apiUrl(path, params = {}) {
  const url = new URL(`${apiRoot}/${path.replace(/^\//, '')}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }
  return url
}

async function request(path, options = {}, params = {}) {
  const response = await fetch(apiUrl(path, params), {
    ...options,
    headers: {
      Accept: 'application/json',
      Authorization: authorization,
      ...options.headers,
    },
    signal: AbortSignal.timeout(30000),
  })
  const body = await response.json()

  if (!response.ok) {
    throw new Error(
      `${options.method || 'GET'} ${path} failed (${response.status}): ${body.message || body.code || 'Unknown error'}`,
    )
  }

  return body
}

async function ensureMedia({ slug, file, title, alt }) {
  const existing = await request('media', {}, { slug, context: 'edit' })
  if (existing.length) {
    const media = await request(`media/${existing[0].id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, alt_text: alt }),
    })
    return media.id
  }

  const extension = extname(file).toLowerCase()
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  }
  const filename = `${slug}${extension}`
  const response = await fetch(apiUrl('media'), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: authorization,
      'Content-Type': contentTypes[extension] || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
    body: await readFile(resolve(projectRoot, file)),
    signal: AbortSignal.timeout(60000),
  })
  const uploaded = await response.json()

  if (!response.ok) {
    throw new Error(
      `Media upload failed (${response.status}): ${uploaded.message || uploaded.code || 'Unknown error'}`,
    )
  }

  const media = await request(`media/${uploaded.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, title, alt_text: alt }),
  })
  return media.id
}

async function ensureEntry(endpoint, slug, data) {
  const existing = await request(endpoint, {}, { slug, context: 'edit' })
  const path = existing.length ? `${endpoint}/${existing[0].id}` : endpoint
  const entry = await request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, status: 'publish', ...data }),
  })
  return entry.id
}

const mediaDefinitions = {
  hero: {
    slug: 'ethos-cms-hero',
    file: 'public/hero-consultants.jpg',
    title: 'Consultores ETHOS',
    alt: 'Consultores Ethos em reunião de procurement e auditoria',
  },
  aboutPrimary: {
    slug: 'ethos-cms-about-primary',
    file: 'public/about-team.jpg',
    title: 'Equipa ETHOS em consultoria',
    alt: 'Equipa Ethos Consulting em consultoria e acompanhamento',
  },
  aboutSecondary: {
    slug: 'ethos-cms-about-secondary',
    file: 'public/about-team-2.jpg',
    title: 'Equipa ETHOS a analisar dados',
    alt: 'Equipa Ethos Consulting a analisar dados em conjunto',
  },
  faq: {
    slug: 'ethos-cms-faq',
    file: 'public/faq-team.jpg',
    title: 'Equipa ETHOS a esclarecer dúvidas',
    alt: 'Equipa Ethos Consulting a esclarecer uma dúvida',
  },
  finalCta: {
    slug: 'ethos-cms-final-cta',
    file: 'public/final-cta.jpg',
    title: 'Chamada final ETHOS',
    alt: '',
  },
  methodology1: {
    slug: 'ethos-cms-methodology-1',
    file: 'public/methodology-step1.jpg',
    title: 'Metodologia - Diagnóstico',
    alt: 'Equipa a realizar um diagnóstico de processos',
  },
  methodology2: {
    slug: 'ethos-cms-methodology-2',
    file: 'public/methodology-step2.jpg',
    title: 'Metodologia - Prioridades',
    alt: 'Equipa a definir prioridades de intervenção',
  },
  methodology3: {
    slug: 'ethos-cms-methodology-3',
    file: 'public/methodology-step3.jpg',
    title: 'Metodologia - Intervenção',
    alt: 'Equipa a implementar melhorias no terreno',
  },
  methodology4: {
    slug: 'ethos-cms-methodology-4',
    file: 'public/methodology-step4.jpg',
    title: 'Metodologia - Verificação',
    alt: 'Equipa a verificar resultados da implementação',
  },
}

const media = Object.fromEntries(
  await Promise.all(
    Object.entries(mediaDefinitions).map(async ([key, definition]) => [
      key,
      await ensureMedia(definition),
    ]),
  ),
)

const homepage = await request('pages/6', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Início',
    slug: 'inicio',
    status: 'publish',
    acf: {
      hero_headline_line_1: 'Compras mais transparentes.',
      hero_headline_line_2: 'Fornecedores mais fiáveis. Menos risco.',
      hero_subtitle:
        'Ajudamos organizações em Moçambique a tornar as suas compras, cadeias de abastecimento e práticas ESG mais eficientes, seguras e responsáveis, com auditoria independente e acompanhamento prático até à implementação.',
      hero_image: media.hero,
      hero_image_alt: mediaDefinitions.hero.alt,
      appointment_title: 'Marcar Diagnóstico',
      appointment_subtitle: 'Sem compromisso. Resposta em até 2 dias úteis.',
      appointment_button_label: 'Marcar Diagnóstico',
      about_tagline: 'Sobre a Ethos Consulting',
      about_title: 'Uma consultoria construída à volta de uma palavra',
      about_paragraphs: [
        {
          text: 'A ETHOS CONSULTING nasce de uma convicção simples: compras, cadeias de abastecimento e sustentabilidade só funcionam com critério, verificação e responsabilidade — não por intuição ou hábito. Somos especialistas em Procurement, Supply Chain, Auditoria e ESG, com uma abordagem prática que acompanha a implementação até resultar no terreno.',
        },
      ],
      about_checkpoints: [
        { text: 'Rigor ético e independência absoluta.' },
        { text: 'Equipas capacitadas para autonomia sustentada.' },
        { text: 'Critérios ESG reais, não apenas em relatórios.' },
      ],
      about_contact_prompt: 'Tem alguma dúvida ou desafio específico?',
      about_phone: '+258 84 613 8863',
      about_primary_cta_label: 'Marcar Diagnóstico',
      about_secondary_cta_label: 'Ver a Nossa Metodologia',
      about_primary_image: media.aboutPrimary,
      about_secondary_image: media.aboutSecondary,
      metrics: [
        { key: 'growth', value: '2.6x', label: 'Crescimento médio' },
        {
          key: 'satisfaction',
          value: '88.6%',
          label: 'Satisfação de clientes',
        },
        { key: 'customers', value: '3M+', label: 'Clientes satisfeitos' },
      ],
      methodology_tagline: 'A Nossa Metodologia',
      methodology_title: 'Um processo, não uma promessa',
      methodology_cta_label: 'Marcar Diagnóstico',
      faq_tagline: 'Perguntas Frequentes',
      faq_title: 'As respostas que precisa antes de avançar',
      faq_image: media.faq,
      faq_image_alt: mediaDefinitions.faq.alt,
      blog_tagline: 'Blog',
      blog_title: 'Leia os Nossos Artigos',
      blog_feed_limit: 6,
      final_cta_tagline: 'Fale Connosco',
      final_cta_title:
        'O próximo processo de compras da sua organização pode ser diferente',
      final_cta_button_label: 'Marcar conversa de diagnóstico',
      final_cta_microcopy: 'Resposta em até 2 dias úteis.',
      final_cta_background: media.finalCta,
    },
  }),
})

const contact = await request('pages/7', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Contacto',
    slug: 'contacto',
    status: 'publish',
    acf: {
      seo_title: 'Contacto — ETHOS CONSULTING',
      heading: 'Fale connosco',
      intro:
        'Descreva brevemente o desafio da sua organização — respondemos normalmente em até 2 dias úteis.',
      success_heading: 'Mensagem recebida.',
      success_message:
        'Obrigado pelo contacto — respondemos normalmente em até 2 dias úteis.',
      response_time_message: 'Resposta em até 2 dias úteis.',
    },
  }),
})

const services = [
  ['procurement-estrategico', 'Procurement Estratégico'],
  ['auditoria-procurement', 'Auditoria de Procurement'],
  ['supply-chain', 'Supply Chain'],
  ['gestao-fornecedores', 'Gestão de Fornecedores'],
  ['esg-sustentabilidade', 'ESG e Sustentabilidade'],
  ['consultoria-estrategica', 'Consultoria Estratégica'],
]

const serviceIds = []
for (const [index, [slug, title]] of services.entries()) {
  serviceIds.push(
    await ensureEntry('services', slug, {
      title,
      menu_order: index + 1,
      acf: { short_description: '', active: true },
    }),
  )
}

const methodology = [
  {
    slug: 'diagnostico',
    title: 'Diagnóstico',
    subtitle: 'Mapeamos riscos e ineficiências antes de agir.',
    description:
      'Analisamos os seus processos actuais de compras, fornecedores e cadeia de abastecimento para identificar riscos, ineficiências e lacunas de conformidade.',
    media: 'methodology1',
    points: [
      {
        label: 'Análise de Processos:',
        text: 'Revisão de como as compras e a cadeia de abastecimento funcionam hoje, na prática.',
      },
      {
        label: 'Identificação de Risco:',
        text: 'Deteção de riscos, ineficiências e lacunas de conformidade antes que se tornem problemas.',
      },
    ],
  },
  {
    slug: 'prioridades',
    title: 'Prioridades',
    subtitle: 'Definimos, em conjunto, onde agir primeiro.',
    description:
      'Definimos, em conjunto, quais os pontos que têm maior impacto no custo, no risco e na sustentabilidade da organização.',
    media: 'methodology2',
    points: [
      {
        label: 'Impacto no Negócio:',
        text: 'Priorização dos pontos com maior impacto no custo, no risco e na sustentabilidade.',
      },
      {
        label: 'Decisão Conjunta:',
        text: 'Definição do plano de ação junto com a sua equipa, não imposto de fora.',
      },
    ],
  },
  {
    slug: 'intervencao',
    title: 'Intervenção',
    subtitle: 'Implementamos as melhorias no terreno.',
    description:
      'Implementamos as melhorias — de processos, controlos, critérios de decisão ou gestão de fornecedores — com acompanhamento prático até à implementação estar em curso.',
    media: 'methodology3',
    points: [
      {
        label: 'Melhoria de Processos:',
        text: 'Novos controlos, critérios de decisão e práticas de gestão de fornecedores.',
      },
      {
        label: 'Acompanhamento Prático:',
        text: 'Presença no terreno até as mudanças estarem realmente em curso.',
      },
    ],
  },
  {
    slug: 'verificacao',
    title: 'Verificação',
    subtitle: 'Medimos resultados e ajustamos o que for preciso.',
    description:
      'Medimos resultados e ajustamos. Um processo só é bom se continuar a funcionar sem nós lá dentro.',
    media: 'methodology4',
    points: [
      {
        label: 'Medição de Resultados:',
        text: 'Acompanhamento dos indicadores de desempenho e risco após a implementação.',
      },
      {
        label: 'Autonomia Sustentada:',
        text: 'Um processo só é bom se continuar a funcionar sem nós lá dentro.',
      },
    ],
  },
]

const methodologyIds = []
for (const [index, step] of methodology.entries()) {
  methodologyIds.push(
    await ensureEntry('methodology', step.slug, {
      title: step.title,
      menu_order: index + 1,
      featured_media: media[step.media],
      acf: {
        subtitle: step.subtitle,
        detail_heading: step.title,
        detail_description: step.description,
        image_alt: mediaDefinitions[step.media].alt,
        points: step.points,
      },
    }),
  )
}

const faqs = [
  [
    'grandes-empresas',
    'A ETHOS CONSULTING trabalha só com grandes empresas?',
    'Não. Trabalhamos com organizações públicas, privadas, ONGs e PMEs — o ponto de partida é sempre um diagnóstico à medida da dimensão e maturidade da organização.',
  ],
  [
    'auditoria-procurement',
    'Uma auditoria de procurement é a mesma coisa que uma auditoria financeira?',
    'Não. Focamo-nos especificamente em processos de compras, fornecedores e cadeia de abastecimento — conformidade, controlos internos e risco operacional, não demonstrações financeiras.',
  ],
  [
    'tempo-diagnostico',
    'Quanto tempo demora um diagnóstico inicial?',
    'Normalmente entre 2 a 4 semanas, dependendo da dimensão da organização e do número de processos a rever.',
  ],
  [
    'fora-de-maputo',
    'Trabalham fora de Maputo?',
    'Sim — trabalhamos com organizações em todo Moçambique e, remotamente, na região da SADC.',
  ],
]

const faqIds = []
for (const [index, [slug, title, answer]] of faqs.entries()) {
  faqIds.push(
    await ensureEntry('faqs', slug, {
      title,
      menu_order: index + 1,
      acf: { answer },
    }),
  )
}

console.log(
  JSON.stringify(
    {
      pages: { homepage: homepage.id, contact: contact.id },
      media: Object.keys(media).length,
      services: serviceIds.length,
      methodology: methodologyIds.length,
      faqs: faqIds.length,
    },
    null,
    2,
  ),
)
