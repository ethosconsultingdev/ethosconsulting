// Client-safe: shared between the contact form component (client-side
// feedback) and the server function's `.validator()` (source of truth).
import { z } from 'zod'

export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Indique o seu nome.').max(120),
  email: z.email('Indique um e-mail válido.'),
  organisation: z.string().trim().max(160).optional().or(z.literal('')),
  area: z.enum([
    'procurement-estrategico',
    'auditoria-procurement',
    'supply-chain',
    'gestao-fornecedores',
    'esg-sustentabilidade',
    'consultoria-estrategica',
    'outro',
  ]),
  message: z
    .string()
    .trim()
    .min(10, 'Descreva brevemente o desafio (mín. 10 caracteres).')
    .max(2000),
})

export type InquiryInput = z.infer<typeof inquirySchema>
