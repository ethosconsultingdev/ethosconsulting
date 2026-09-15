// Static marketing copy for the ETHOS CONSULTING landing page (PT).
// Client-safe: no secrets, no server-only APIs — imported from both the
// route loader (see `src/routes/index.tsx`) and the section components.
// Sourced from `ethos-landing-copy-pt.md` at the project root.

// Split as two explicit lines (rather than left to wrap) so the hero
// headline always renders as exactly 2 lines, at every viewport width.
export const heroHeadlineLines = [
  'Compras mais transparentes.',
  'Fornecedores mais fiáveis. Menos risco.',
]

export const heroSubtitle =
  'Ajudamos organizações em Moçambique a tornar as suas compras, cadeias de abastecimento e práticas ESG mais eficientes, seguras e responsáveis, com auditoria independente e acompanhamento prático até à implementação.'

export const topBarAnnouncement =
  'Procurement · Supply Chain · Auditoria · ESG em Moçambique | Consultoria independente orientada a resultados'

export const heroAppointmentCard = {
  title: 'Marcar Diagnóstico',
  subtitle: 'Sem compromisso. Resposta em até 2 dias úteis.',
  nameLabel: 'O seu nome*',
  namePlaceholder: 'Ex: Maria Daniel',
  emailLabel: 'Endereço de e-mail*',
  emailPlaceholder: 'voce@empresa.com',
  messageLabel: 'Mensagem*',
  messagePlaceholder: 'Descreva brevemente o seu desafio...',
  ctaButton: 'Marcar Diagnóstico',
}

export const aboutSection = {
  tagline: 'Sobre a Ethos Consulting',
  title: 'Uma consultoria construída à volta de uma palavra',
  paragraphs: [
    'A ETHOS CONSULTING nasce de uma convicção simples: compras, cadeias de abastecimento e sustentabilidade só funcionam com critério, verificação e responsabilidade — não por intuição ou hábito. Somos especialistas em Procurement, Supply Chain, Auditoria e ESG, com uma abordagem prática que acompanha a implementação até resultar no terreno.',
  ],
  checkpoints: [
    'Rigor ético e independência absoluta.',
    'Equipas capacitadas para autonomia sustentada.',
    'Critérios ESG reais, não apenas em relatórios.',
  ],
  contactPrompt: 'Tem alguma dúvida ou desafio específico?',
  phone: '+258 84 000 0000',
  primaryCtaSub: 'Marcar Diagnóstico',
  secondaryCta: 'Ver a Nossa Metodologia',
}

export interface ImpactMetric {
  id: string
  value: string
  label: string
}

export const impactMetrics: ImpactMetric[] = [
  {
    id: 'growth',
    value: '2.6x',
    label: 'Crescimento médio',
  },
  {
    id: 'satisfaction',
    value: '88.6%',
    label: 'Satisfação de clientes',
  },
  {
    id: 'customers',
    value: '3M+',
    label: 'Clientes satisfeitos',
  },
]

// Service taxonomy used by the contact form's "area of interest" picker
// (see `ContactForm` and `inquiries.schema.ts`) — kept even though the
// homepage no longer has a dedicated Services section.
export interface Service {
  id: string
  name: string
}

export const services: Service[] = [
  { id: 'procurement-estrategico', name: 'Procurement Estratégico' },
  { id: 'auditoria-procurement', name: 'Auditoria de Procurement' },
  { id: 'supply-chain', name: 'Supply Chain' },
  { id: 'gestao-fornecedores', name: 'Gestão de Fornecedores' },
  { id: 'esg-sustentabilidade', name: 'ESG e Sustentabilidade' },
  { id: 'consultoria-estrategica', name: 'Consultoria Estratégica' },
]

export interface QuickBusinessPoint {
  label: string
  text: string
}

export interface QuickBusinessStepItem {
  id: string
  step: number
  title: string
  subtitle: string
  detailHeading: string
  detailDescription: string
  image: string
  points: QuickBusinessPoint[]
}

export const quickBusinessStepsSection = {
  tagline: 'A Nossa Metodologia',
  title: 'Um processo, não uma promessa',
  ctaButton: 'Marcar Diagnóstico',
  steps: [
    {
      id: 'diagnostico',
      step: 1,
      title: 'Diagnóstico',
      subtitle: 'Mapeamos riscos e ineficiências antes de agir.',
      detailHeading: 'Diagnóstico',
      detailDescription:
        'Analisamos os seus processos actuais de compras, fornecedores e cadeia de abastecimento para identificar riscos, ineficiências e lacunas de conformidade.',
      image: '/methodology-step1.jpg',
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
      id: 'prioridades',
      step: 2,
      title: 'Prioridades',
      subtitle: 'Definimos, em conjunto, onde agir primeiro.',
      detailHeading: 'Prioridades',
      detailDescription:
        'Definimos, em conjunto, quais os pontos que têm maior impacto no custo, no risco e na sustentabilidade da organização.',
      image: '/methodology-step2.jpg',
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
      id: 'intervencao',
      step: 3,
      title: 'Intervenção',
      subtitle: 'Implementamos as melhorias no terreno.',
      detailHeading: 'Intervenção',
      detailDescription:
        'Implementamos as melhorias — de processos, controlos, critérios de decisão ou gestão de fornecedores — com acompanhamento prático até à implementação estar em curso.',
      image: '/methodology-step3.jpg',
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
      id: 'verificacao',
      step: 4,
      title: 'Verificação',
      subtitle: 'Medimos resultados e ajustamos o que for preciso.',
      detailHeading: 'Verificação',
      detailDescription:
        'Medimos resultados e ajustamos. Um processo só é bom se continuar a funcionar sem nós lá dentro.',
      image: '/methodology-step4.jpg',
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
  ],
}

export const faqTagline = 'Perguntas Frequentes'
export const faqTitle = 'As respostas que precisa antes de avançar'

export interface FaqItem {
  question: string
  answer: string
}

export const faq: FaqItem[] = [
  {
    question: 'A ETHOS CONSULTING trabalha só com grandes empresas?',
    answer:
      'Não. Trabalhamos com organizações públicas, privadas, ONGs e PMEs — o ponto de partida é sempre um diagnóstico à medida da dimensão e maturidade da organização.',
  },
  {
    question:
      'Uma auditoria de procurement é a mesma coisa que uma auditoria financeira?',
    answer:
      'Não. Focamo-nos especificamente em processos de compras, fornecedores e cadeia de abastecimento — conformidade, controlos internos e risco operacional, não demonstrações financeiras.',
  },
  {
    question: 'Quanto tempo demora um diagnóstico inicial?',
    answer:
      'Normalmente entre 2 a 4 semanas, dependendo da dimensão da organização e do número de processos a rever.',
  },
  {
    question: 'Trabalham fora de Maputo?',
    answer:
      'Sim — trabalhamos com organizações em todo Moçambique e, remotamente, na região da SADC.',
  },
]

export const finalCta = {
  tagline: 'Fale Connosco',
  title: 'O próximo processo de compras da sua organização pode ser diferente',
  cta: 'Marcar conversa de diagnóstico',
  micro: 'Resposta em até 2 dias úteis.',
}

export const siteInfo = {
  name: 'ETHOS CONSULTING',
  tagline: 'Procurement · Supply Chain · Auditoria de Procurement · ESG',
  location: 'Maputo, Moçambique',
  description:
    'Consultoria especializada em Procurement, Supply Chain, Auditoria de Procurement e ESG em Moçambique.',
}

export interface FooterLocation {
  label: string
  name: string
  lines: string[]
}

// Three honest cards reflecting where ETHOS actually operates (per the
// FAQ: Maputo office, nationwide, and remote SADC support) — not
// fabricated offices. Maputo's contact details are placeholders; confirm
// the real address/e-mail before this goes live.
export const officeLocations: FooterLocation[] = [
  {
    label: 'Localização 01',
    name: 'Escritório de Maputo',
    lines: ['Maputo, Moçambique', '[e-mail a confirmar]', '+258 84 000 0000'],
  },
  {
    label: 'Localização 02',
    name: 'Cobertura Nacional',
    lines: ['Atendemos organizações em todo Moçambique.'],
  },
  {
    label: 'Localização 03',
    name: 'Região SADC',
    lines: ['Apoio remoto a organizações na região da SADC.'],
  },
]

export const footerLinks = [
  { label: 'Metodologia', href: '/#metodologia' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contacto', href: '/contacto' },
]

export const blogSection = {
  tagline: 'Blog',
  title: 'Leia os Nossos Artigos',
}

export interface BlogPost {
  date: string
  author: string
  title: string
  image: string
}

export const blogPosts: BlogPost[] = [
  {
    date: '24 Fev, 2025',
    author: 'Equipa Ethos',
    title: 'Como uma auditoria de procurement reduz o risco de fornecedores',
    image: '/blog-procurement-audit.jpg',
  },
  {
    date: '26 Mar, 2025',
    author: 'Equipa Ethos',
    title: 'ESG na cadeia de abastecimento: da teoria à prática em Moçambique',
    image: '/blog-esg-supply-chain.jpg',
  },
]
