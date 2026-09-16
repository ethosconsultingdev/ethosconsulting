export interface WordPressPost {
  id: number
  slug: string
  title: string
  excerpt: string
  excerptHtml: string
  contentHtml: string
  date: string
  author: string
  image: string | null
  imageAlt: string
}

export interface CmsImage {
  url: string
  alt: string
}

export interface CmsMethodologyStep {
  id: string
  step: number
  title: string
  subtitle: string
  detailHeading: string
  detailDescription: string
  image: string
  imageAlt: string
  points: Array<{ label: string; text: string }>
}

export interface CmsFaq {
  id: number
  question: string
  answer: string
}

export interface CmsService {
  id: string
  name: string
}

export interface HomePageContent {
  hero: {
    headlineLines: [string, string]
    subtitle: string
    image: CmsImage
    appointmentTitle: string
    appointmentSubtitle: string
    appointmentButtonLabel: string
  }
  about: {
    tagline: string
    title: string
    paragraphs: string[]
    checkpoints: string[]
    contactPrompt: string
    phone: string
    primaryCtaLabel: string
    secondaryCtaLabel: string
    primaryImage: CmsImage
    secondaryImage: CmsImage
  }
  methodology: {
    tagline: string
    title: string
    ctaLabel: string
    steps: CmsMethodologyStep[]
  }
  faq: {
    tagline: string
    title: string
    image: CmsImage
    items: CmsFaq[]
  }
  blog: {
    tagline: string
    title: string
  }
  finalCta: {
    tagline: string
    title: string
    buttonLabel: string
    microcopy: string
    backgroundImage: string
  }
}

export interface ContactPageContent {
  seoTitle: string
  heading: string
  intro: string
  successHeading: string
  successMessage: string
  responseTimeMessage: string
}
