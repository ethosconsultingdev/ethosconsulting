import { createFileRoute } from '@tanstack/react-router'

import { ContactForm } from '#/components/ContactForm'
import {
  getContactPageContent,
  getServices,
} from '#/server/wordpress.functions'

export const Route = createFileRoute('/contacto')({
  // Still a marketing-relevant page (worth indexing, should render fast for
  // a visitor arriving from an ad or search result), so it keeps the
  // default full SSR — unlike `/simulador`, which has no SEO value.
  ssr: true,
  loader: async () => {
    const [content, services] = await Promise.allSettled([
      getContactPageContent(),
      getServices(),
    ])
    return {
      content: content.status === 'fulfilled' ? content.value : null,
      services: services.status === 'fulfilled' ? services.value : [],
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.content?.seoTitle || 'Contacto — ETHOS CONSULTING',
      },
    ],
  }),
  component: ContactPage,
})

function ContactPage() {
  const { content, services } = Route.useLoaderData()

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">
        {content?.heading || 'Fale connosco'}
      </h1>
      <p className="mt-3 text-slate-600">
        {content?.intro ||
          'Descreva brevemente o desafio da sua organização — respondemos normalmente em até 2 dias úteis.'}
      </p>
      <div className="mt-8">
        <ContactForm
          cmsServices={services}
          successHeading={content?.successHeading}
          successMessage={content?.successMessage}
        />
      </div>
    </section>
  )
}
