// Server-only helper. Never imported from client code — only from
// `inquiries.functions.ts`, inside a server function handler. Has
// filesystem access, which is exactly the kind of capability that must
// stay behind the server-only boundary and never reach the client bundle.
import { randomUUID } from 'node:crypto'
import { mkdir, appendFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import type { InquiryInput } from './inquiries.schema'

// Stands in for a real destination (CRM, database, notification e-mail).
// A local, append-only file is enough to make the round trip real without
// standing up infrastructure for a landing page demo.
const STORE_PATH = join(process.cwd(), '.data', 'inquiries.jsonl')

export interface StoredInquiry extends InquiryInput {
  id: string
  receivedAt: string
}

export async function saveInquiry(input: InquiryInput): Promise<StoredInquiry> {
  const record: StoredInquiry = {
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    ...input,
  }

  await mkdir(dirname(STORE_PATH), { recursive: true })
  await appendFile(STORE_PATH, `${JSON.stringify(record)}\n`, 'utf8')

  return record
}
