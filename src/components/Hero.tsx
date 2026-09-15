import { useState } from 'react'

import {
  heroAppointmentCard,
  heroHeadlineLines,
  heroSubtitle,
} from '#/content/copy'
import { submitInquiry } from '#/server/inquiries.functions'
import { inquirySchema } from '#/server/inquiries.schema'
import type { HomePageContent } from '#/server/wordpress.types'
import { TurnstileField } from '#/components/TurnstileField'

export function Hero({ content }: { content?: HomePageContent['hero'] }) {
  const hero =
    content ||
    ({
      headlineLines: heroHeadlineLines,
      subtitle: heroSubtitle,
      image: {
        url: '/hero-consultants.jpg',
        alt: 'Consultores Ethos em reunião de procurement e auditoria',
      },
      appointmentTitle: heroAppointmentCard.title,
      appointmentSubtitle: heroAppointmentCard.subtitle,
      appointmentButtonLabel: heroAppointmentCard.ctaButton,
    } satisfies HomePageContent['hero'])

  // Form state for the appointment card
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '',
    turnstileToken: '',
  })
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [turnstileReset, setTurnstileReset] = useState(0)

  async function handleAppointmentSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage(null)

    const parsed = inquirySchema.safeParse({
      name: formData.name,
      email: formData.email,
      organisation: '',
      area: 'procurement-estrategico',
      message: formData.message,
      website: formData.website,
      turnstileToken: formData.turnstileToken,
    })

    if (!parsed.success) {
      const errors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (typeof key === 'string' && !errors[key]) errors[key] = issue.message
      }
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})

    try {
      setStatus('submitting')
      await submitInquiry({ data: parsed.data })
      setStatus('success')
      setTurnstileReset((value) => value + 1)
      setFormData({
        name: '',
        email: '',
        message: '',
        website: '',
        turnstileToken: '',
      })
    } catch (err) {
      setStatus('error')
      setTurnstileReset((value) => value + 1)
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Não foi possível enviar o pedido. Tente novamente.',
      )
    }
  }

  return (
    <section className="bg-[#16282e] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        {/* Top Header Block: Tagline, Headline, Subtitle */}
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-tight">
            {hero.headlineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-slate-300 sm:text-lg sm:leading-relaxed">
            {hero.subtitle}
          </p>
        </div>

        {/* Main 2-Column Hero Area: Left Photo + Right Floating Appointment Form */}
        <div className="mt-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Consultants Photo */}
          <div className="lg:col-span-7">
            <div className="h-full min-h-[340px] overflow-hidden rounded-xl">
              <img
                src={hero.image.url}
                alt={hero.image.alt}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* Right Column: Appointment Card matching reference design */}
          <div id="marcar-consulta" className="scroll-mt-24 lg:col-span-5">
            <div className="flex h-full flex-col justify-between rounded-xl bg-white p-6 text-slate-900 sm:p-7">
              <div>
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-bold tracking-tight text-[#16282e]">
                    {hero.appointmentTitle}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {hero.appointmentSubtitle}
                  </p>
                </div>

                {status === 'success' ? (
                  <div className="my-6 rounded-lg border border-teal-200 bg-teal-50 p-5 text-teal-900">
                    <p className="font-bold">
                      ✓ Mensagem recebida com sucesso!
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-teal-800">
                      Obrigado pelo contacto. A nossa equipa de consultoria
                      entrará em contacto em até 2 dias úteis.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="mt-4 text-xs font-semibold text-teal-800 underline hover:text-teal-950"
                    >
                      Enviar outro agendamento
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleAppointmentSubmit}
                    className="mt-4 space-y-4"
                    noValidate
                  >
                    {errorMessage ? (
                      <p className="rounded-md bg-red-50 p-2.5 text-xs text-red-700">
                        {errorMessage}
                      </p>
                    ) : null}

                    <div>
                      <label className="block text-xs font-semibold text-slate-800">
                        {heroAppointmentCard.nameLabel}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder={heroAppointmentCard.namePlaceholder}
                        className="mt-1 w-full rounded-md border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                      />
                      {fieldErrors.name ? (
                        <p className="mt-1 text-xs text-red-600">
                          {fieldErrors.name}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800">
                        {heroAppointmentCard.emailLabel}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder={heroAppointmentCard.emailPlaceholder}
                        className="mt-1 w-full rounded-md border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                      />
                      {fieldErrors.email ? (
                        <p className="mt-1 text-xs text-red-600">
                          {fieldErrors.email}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800">
                        {heroAppointmentCard.messageLabel}
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder={heroAppointmentCard.messagePlaceholder}
                        className="mt-1 w-full resize-none rounded-md border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                      />
                      {fieldErrors.message ? (
                        <p className="mt-1 text-xs text-red-600">
                          {fieldErrors.message}
                        </p>
                      ) : null}
                    </div>

                    <label
                      className="absolute -left-[10000px]"
                      aria-hidden="true"
                    >
                      Website
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                      />
                    </label>

                    <TurnstileField
                      onToken={(turnstileToken) =>
                        setFormData({ ...formData, turnstileToken })
                      }
                      resetSignal={turnstileReset}
                    />

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-[#138275] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f6f63] disabled:opacity-50"
                    >
                      {status === 'submitting' ? (
                        'A enviar…'
                      ) : (
                        <>
                          {hero.appointmentButtonLabel}
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button matching reference screenshot */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-[#138275] text-white transition-all hover:scale-110 hover:bg-[#0f6f63]"
        aria-label="Voltar ao topo"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 15.75 7.5-7.5 7.5 7.5"
          />
        </svg>
      </button>
    </section>
  )
}
