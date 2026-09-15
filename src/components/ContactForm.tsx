import { useState } from 'react'

import { services } from '#/content/copy'
import { inquirySchema } from '#/server/inquiries.schema'
import { submitInquiry } from '#/server/inquiries.functions'
import type { CmsService } from '#/server/wordpress.types'
import { TurnstileField } from '#/components/TurnstileField'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const emptyForm = {
  name: '',
  email: '',
  organisation: '',
  area: 'procurement-estrategico',
  message: '',
  website: '',
  turnstileToken: '',
}

export function ContactForm({
  cmsServices = [],
  successHeading = 'Mensagem recebida.',
  successMessage = 'Obrigado pelo contacto — respondemos normalmente em até 2 dias úteis.',
}: {
  cmsServices?: CmsService[]
  successHeading?: string
  successMessage?: string
}) {
  const areaOptions = [
    ...(cmsServices.length ? cmsServices : services),
    { id: 'outro', name: 'Outro' },
  ]
  const initialForm = { ...emptyForm, area: areaOptions[0]?.id || 'outro' }
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState<Status>('idle')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [turnstileReset, setTurnstileReset] = useState(0)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    // Client-side validation reuses the exact same schema the server
    // function validates against — one source of truth, two checkpoints.
    // This is only for fast feedback; the server never trusts it.
    const parsed = inquirySchema.safeParse(form)
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
      setForm(initialForm)
    } catch (error) {
      setStatus('error')
      setTurnstileReset((value) => value + 1)
      setFormError(
        error instanceof Error
          ? error.message
          : 'Não foi possível enviar. Tente novamente.',
      )
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
        <p className="font-semibold">{successHeading}</p>
        <p className="mt-1 text-sm">{successMessage}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {formError ? (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </p>
      ) : null}

      <Field label="Nome" error={fieldErrors.name}>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </Field>

      <Field label="E-mail" error={fieldErrors.email}>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Organização (opcional)" error={fieldErrors.organisation}>
        <input
          type="text"
          value={form.organisation}
          onChange={(e) => setForm({ ...form, organisation: e.target.value })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Área de interesse" error={fieldErrors.area}>
        <select
          value={form.area}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {areaOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Mensagem" error={fieldErrors.message}>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={5}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </Field>

      <label className="absolute -left-[10000px]" aria-hidden="true">
        Website
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
      </label>

      <TurnstileField
        onToken={(turnstileToken) => setForm({ ...form, turnstileToken })}
        resetSignal={turnstileReset}
      />

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {status === 'submitting' ? 'A enviar…' : 'Enviar'}
      </button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </label>
  )
}
