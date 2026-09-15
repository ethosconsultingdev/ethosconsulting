import { createFileRoute } from '@tanstack/react-router'

import { ContactForm } from '#/components/ContactForm'

export const Route = createFileRoute('/contacto')({
  // Still a marketing-relevant page (worth indexing, should render fast for
  // a visitor arriving from an ad or search result), so it keeps the
  // default full SSR — unlike `/simulador`, which has no SEO value.
  ssr: true,
  head: () => ({
    meta: [{ title: 'Contacto — ETHOS CONSULTING' }],
  }),
  component: ContactPage,
})

function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">Fale connosco</h1>
      <p className="mt-3 text-slate-600">
        Descreva brevemente o desafio da sua organização — respondemos
        normalmente em até 2 dias úteis.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </section>
  )
}
