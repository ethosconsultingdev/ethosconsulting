// Typed server function wrapper — safe to import from anywhere (route
// components, event handlers). Validates on the server (never trust client
// input, even though the form also validates client-side for UX) and
// delegates the actual write to the server-only module.
import { createServerFn } from '@tanstack/react-start'

import { inquirySchema } from './inquiries.schema'
import { saveInquiry } from './inquiries.server'

export const submitInquiry = createServerFn({ method: 'POST' })
  .validator(inquirySchema)
  .handler(async ({ data }) => {
    const record = await saveInquiry(data)
    return { ok: true as const, id: record.id }
  })
