import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!

// Local dev only: bypass TLS for corporate proxies / self-signed certs.
// Never runs on Vercel (NODE_ENV === 'production' there).
let customFetch: typeof fetch | undefined
if (
  process.env.NODE_ENV === 'development' &&
  process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0' &&
  typeof globalThis.fetch === 'function'
) {
  try {
    const { Agent, fetch: undiciFetch } = require('undici')
    const agent = new Agent({ connect: { rejectUnauthorized: false } })
    customFetch = (input: RequestInfo | URL, init?: RequestInit) =>
      undiciFetch(input, { ...init, dispatcher: agent } as RequestInit)
  } catch {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  ...(customFetch && { global: { fetch: customFetch } }),
})
