import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/supabase-check
 * Verifies Supabase connection and that the property table exists.
 * Call this to confirm why properties might not be returning.
 */
export async function GET() {
  const url = process.env.SUPABASE_URL
  const hasKey = Boolean(process.env.SUPABASE_SERVICE_KEY)

  if (!url || !hasKey) {
    return NextResponse.json({
      ok: false,
      error: 'Missing Supabase config',
      details: {
        hasUrl: Boolean(url),
        hasServiceKey: hasKey,
        hint: 'Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local',
      },
    }, { status: 503 })
  }

  const { data, error } = await supabase
    .from('property')
    .select('id')
    .eq('published', true)
    .limit(1)

  if (error) {
    const isMissingTable = error.code === '42P01'
    const isTlsError =
      error.message?.includes('fetch failed') ||
      String(error.details ?? '').includes('SELF_SIGNED_CERT') ||
      String(error.details ?? '').includes('certificate')
    const hint = isMissingTable
      ? 'The "property" table does not exist. Run the SQL in supabase/property-table.sql in your Supabase SQL Editor.'
      : isTlsError
        ? 'TLS/certificate error: Node cannot verify the HTTPS connection (e.g. corporate proxy). For local dev only, try: set NODE_TLS_REJECT_UNAUTHORIZED=0 in .env.local (never in production).'
        : 'Check your Supabase project: Table "property" and RLS (if enabled) must allow service_role access.'
    return NextResponse.json({
      ok: false,
      error: error.message,
      code: error.code,
      details: error.details,
      hint,
    }, { status: 503 })
  }

  return NextResponse.json({
    ok: true,
    message: 'Supabase connected; property table exists',
    propertiesCount: data?.length ?? 0,
  })
}
