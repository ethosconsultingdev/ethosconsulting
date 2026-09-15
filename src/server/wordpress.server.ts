import { z } from 'zod'

import type {
  CmsFaq,
  CmsMethodologyStep,
  CmsService,
  ContactPageContent,
  HomePageContent,
  WordPressPost,
} from './wordpress.types'

const DEFAULT_API_URL = 'https://admin.ethosconsultingmz.co.mz/wp-json/wp/v2'

const renderedSchema = z.object({ rendered: z.string() })

const postSchema = z.object({
  id: z.number(),
  slug: z.string(),
  date: z.string(),
  title: renderedSchema,
  excerpt: renderedSchema,
  content: renderedSchema,
  _embedded: z
    .object({
      author: z.array(z.object({ name: z.string() })).optional(),
      'wp:featuredmedia': z
        .array(
          z.object({
            source_url: z.string(),
            alt_text: z.string().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
})

const postsSchema = z.array(postSchema)

const imageSchema = z.object({
  url: z.url(),
  alt: z.string().optional().default(''),
})

const homepageFieldsSchema = z.object({
  hero_headline_line_1: z.string().min(1),
  hero_headline_line_2: z.string().min(1),
  hero_subtitle: z.string().min(1),
  hero_image: imageSchema,
  hero_image_alt: z.string().optional().default(''),
  appointment_title: z.string().min(1),
  appointment_subtitle: z.string().min(1),
  appointment_button_label: z.string().min(1),
  about_tagline: z.string().min(1),
  about_title: z.string().min(1),
  about_paragraphs: z.array(z.object({ text: z.string().min(1) })).min(1),
  about_checkpoints: z.array(z.object({ text: z.string().min(1) })).min(1),
  about_contact_prompt: z.string().min(1),
  about_phone: z.string().min(1),
  about_primary_cta_label: z.string().min(1),
  about_secondary_cta_label: z.string().min(1),
  about_primary_image: imageSchema,
  about_secondary_image: imageSchema,
  metrics: z
    .array(
      z.object({
        key: z.enum(['growth', 'satisfaction', 'customers']),
        value: z.string().min(1),
        label: z.string().min(1),
      }),
    )
    .length(3),
  methodology_tagline: z.string().min(1),
  methodology_title: z.string().min(1),
  methodology_cta_label: z.string().min(1),
  faq_tagline: z.string().min(1),
  faq_title: z.string().min(1),
  faq_image: imageSchema,
  faq_image_alt: z.string().optional().default(''),
  blog_tagline: z.string().min(1),
  blog_title: z.string().min(1),
  blog_feed_limit: z.coerce.number().int().min(1).max(12),
  final_cta_tagline: z.string().min(1),
  final_cta_title: z.string().min(1),
  final_cta_button_label: z.string().min(1),
  final_cta_microcopy: z.string().min(1),
  final_cta_background: imageSchema,
})

const contactFieldsSchema = z.object({
  seo_title: z.string().min(1),
  heading: z.string().min(1),
  intro: z.string().min(1),
  success_heading: z.string().min(1),
  success_message: z.string().min(1),
  response_time_message: z.string().min(1),
})

const collectionItemSchema = z.object({
  id: z.number(),
  slug: z.string(),
  menu_order: z.number().optional().default(0),
  title: renderedSchema,
  acf: z.unknown().optional(),
  _embedded: z
    .object({
      'wp:featuredmedia': z
        .array(
          z.object({
            source_url: z.string(),
            alt_text: z.string().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
})

const methodologyFieldsSchema = z.object({
  subtitle: z.string().min(1),
  detail_heading: z.string().min(1),
  detail_description: z.string().min(1),
  image_alt: z.string().optional().default(''),
  points: z.array(
    z.object({ label: z.string().min(1), text: z.string().min(1) }),
  ),
})

const faqFieldsSchema = z.object({ answer: z.string().min(1) })
const wordpressBooleanSchema = z
  .union([
    z.boolean(),
    z.literal(0),
    z.literal(1),
    z.literal('0'),
    z.literal('1'),
  ])
  .transform((value) => value === true || value === 1 || value === '1')
const serviceFieldsSchema = z.object({ active: wordpressBooleanSchema })

function getApiUrl(path: string, searchParams?: URLSearchParams) {
  const baseUrl = (process.env.WORDPRESS_API_URL || DEFAULT_API_URL).replace(
    /\/$/,
    '',
  )
  const url = new URL(`${baseUrl}/${path.replace(/^\//, '')}`)
  if (searchParams) url.search = searchParams.toString()
  return url
}

function getHeaders(authenticated = false) {
  const headers = new Headers({ Accept: 'application/json' })
  const username = process.env.WORDPRESS_API_USERNAME
  const password = process.env.WORDPRESS_API_PASSWORD

  if (authenticated && username && password) {
    headers.set('Authorization', `Basic ${btoa(`${username}:${password}`)}`)
  }

  return headers
}

async function requestPosts(path: string, searchParams: URLSearchParams) {
  const response = await fetch(getApiUrl(path, searchParams), {
    headers: getHeaders(),
    signal: AbortSignal.timeout(5000),
  })

  if (!response.ok) {
    throw new Error(`WordPress request failed with status ${response.status}.`)
  }

  return postsSchema.parse(await response.json()).map(normalizePost)
}

async function requestCollection(path: string, searchParams: URLSearchParams) {
  const response = await fetch(getApiUrl(path, searchParams), {
    headers: getHeaders(),
    signal: AbortSignal.timeout(5000),
  })

  if (!response.ok) {
    throw new Error(`WordPress request failed with status ${response.status}.`)
  }

  return z.array(collectionItemSchema).parse(await response.json())
}

async function requestPage(slug: string) {
  const pages = await requestCollection(
    'pages',
    new URLSearchParams({ slug, per_page: '1' }),
  )
  return pages.at(0) || null
}

function normalizePost(post: z.infer<typeof postSchema>): WordPressPost {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]

  return {
    id: post.id,
    slug: post.slug,
    title: toPlainText(post.title.rendered),
    excerpt: toPlainText(post.excerpt.rendered),
    excerptHtml: post.excerpt.rendered,
    contentHtml: post.content.rendered,
    date: new Intl.DateTimeFormat('pt-MZ', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(post.date)),
    author: post._embedded?.author?.[0]?.name || 'Equipa Ethos',
    image: featuredMedia?.source_url || null,
    imageAlt: featuredMedia?.alt_text || toPlainText(post.title.rendered),
  }
}

function toPlainText(html: string) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&#x([\da-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#(?:0*39|x0*27);/gi, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

export function fetchLatestPosts(limit = 6) {
  const searchParams = new URLSearchParams({
    per_page: String(limit),
    _embed: 'author,wp:featuredmedia',
  })
  return requestPosts('posts', searchParams)
}

export async function fetchPostBySlug(slug: string) {
  const searchParams = new URLSearchParams({
    slug,
    per_page: '1',
    _embed: 'author,wp:featuredmedia',
  })
  const posts = await requestPosts('posts', searchParams)
  return posts.at(0) || null
}

export async function fetchHomePageContent(): Promise<HomePageContent | null> {
  const page = await requestPage('inicio')
  if (!page) return null

  const fields = homepageFieldsSchema.safeParse(page.acf)
  if (!fields.success) return null

  const [methodology, faqs] = await Promise.all([
    fetchMethodologySteps(),
    fetchFaqs(),
  ])

  if (!methodology.length || !faqs.length) return null

  const value = fields.data
  return {
    hero: {
      headlineLines: [value.hero_headline_line_1, value.hero_headline_line_2],
      subtitle: value.hero_subtitle,
      image: {
        url: value.hero_image.url,
        alt: value.hero_image_alt || value.hero_image.alt,
      },
      appointmentTitle: value.appointment_title,
      appointmentSubtitle: value.appointment_subtitle,
      appointmentButtonLabel: value.appointment_button_label,
    },
    about: {
      tagline: value.about_tagline,
      title: value.about_title,
      paragraphs: value.about_paragraphs.map(({ text }) => text),
      checkpoints: value.about_checkpoints.map(({ text }) => text),
      contactPrompt: value.about_contact_prompt,
      phone: value.about_phone,
      primaryCtaLabel: value.about_primary_cta_label,
      secondaryCtaLabel: value.about_secondary_cta_label,
      primaryImage: value.about_primary_image,
      secondaryImage: value.about_secondary_image,
    },
    metrics: value.metrics.map((metric) => ({
      id: metric.key,
      value: metric.value,
      label: metric.label,
    })),
    methodology: {
      tagline: value.methodology_tagline,
      title: value.methodology_title,
      ctaLabel: value.methodology_cta_label,
      steps: methodology,
    },
    faq: {
      tagline: value.faq_tagline,
      title: value.faq_title,
      image: {
        url: value.faq_image.url,
        alt: value.faq_image_alt || value.faq_image.alt,
      },
      items: faqs,
    },
    blog: {
      tagline: value.blog_tagline,
      title: value.blog_title,
    },
    finalCta: {
      tagline: value.final_cta_tagline,
      title: value.final_cta_title,
      buttonLabel: value.final_cta_button_label,
      microcopy: value.final_cta_microcopy,
      backgroundImage: value.final_cta_background.url,
    },
  }
}

export async function fetchContactPageContent(): Promise<ContactPageContent | null> {
  const page = await requestPage('contacto')
  if (!page) return null

  const fields = contactFieldsSchema.safeParse(page.acf)
  if (!fields.success) return null

  return {
    seoTitle: fields.data.seo_title,
    heading: fields.data.heading,
    intro: fields.data.intro,
    successHeading: fields.data.success_heading,
    successMessage: fields.data.success_message,
    responseTimeMessage: fields.data.response_time_message,
  }
}

export async function fetchMethodologySteps(): Promise<CmsMethodologyStep[]> {
  const items = await requestCollection(
    'methodology',
    new URLSearchParams({
      per_page: '20',
      order: 'asc',
      orderby: 'menu_order',
      _embed: 'wp:featuredmedia',
    }),
  )

  return items.flatMap((item, index) => {
    const fields = methodologyFieldsSchema.safeParse(item.acf)
    const image = item._embedded?.['wp:featuredmedia']?.[0]
    if (!fields.success || !image) return []

    return [
      {
        id: item.slug,
        step: index + 1,
        title: toPlainText(item.title.rendered),
        subtitle: fields.data.subtitle,
        detailHeading: fields.data.detail_heading,
        detailDescription: fields.data.detail_description,
        image: image.source_url,
        imageAlt:
          fields.data.image_alt ||
          image.alt_text ||
          toPlainText(item.title.rendered),
        points: fields.data.points,
      },
    ]
  })
}

export async function fetchFaqs(): Promise<CmsFaq[]> {
  const items = await requestCollection(
    'faqs',
    new URLSearchParams({
      per_page: '50',
      order: 'asc',
      orderby: 'menu_order',
    }),
  )

  return items.flatMap((item) => {
    const fields = faqFieldsSchema.safeParse(item.acf)
    if (!fields.success) return []
    return [
      {
        id: item.id,
        question: toPlainText(item.title.rendered),
        answer: fields.data.answer,
      },
    ]
  })
}

export async function fetchServices(): Promise<CmsService[]> {
  const items = await requestCollection(
    'services',
    new URLSearchParams({
      per_page: '50',
      order: 'asc',
      orderby: 'menu_order',
    }),
  )

  return items.flatMap((item) => {
    const fields = serviceFieldsSchema.safeParse(item.acf)
    if (!fields.success || !fields.data.active) return []
    return [{ id: item.slug, name: toPlainText(item.title.rendered) }]
  })
}
