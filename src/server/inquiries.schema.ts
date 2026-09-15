// Client-safe: shared between the contact form component (client-side
// feedback) and the server function's `.validator()` (source of truth).
import { z } from 'zod'

export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Indique o seu nome.').max(120),
  email: z.email('Indique um e-mail válido.'),
  organisation: z.string().trim().max(160).optional().or(z.literal('')),
  area: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'Área de interesse inválida.'),
  message: z
    .string()
    .trim()
    .min(10, 'Descreva brevemente o desafio (mín. 10 caracteres).')
    .max(2000),
  website: z.string().max(0).optional().default(''),
  turnstileToken: z.string().max(2048).optional().default(''),
})

export type InquiryInput = z.infer<typeof inquirySchema>
