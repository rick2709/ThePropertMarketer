import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

type Params = { params: Promise<{ id: string }> }

const PROPERTY_IMAGE_FALLBACK = '/images/rearesidential.webp'

function normalizeImageSrc(value: unknown): string {
  const raw = typeof value === 'string' ? value.trim() : ''
  if (!raw) return PROPERTY_IMAGE_FALLBACK
  if (/\s/.test(raw)) return PROPERTY_IMAGE_FALLBACK
  if (raw.startsWith('/')) return raw
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      new URL(raw)
      return raw
    } catch {
      return PROPERTY_IMAGE_FALLBACK
    }
  }
  if (raw.startsWith('images/')) return `/${raw}`
  if (!raw.includes('/')) return `/images/${raw}`
  return PROPERTY_IMAGE_FALLBACK
}

// GET /api/properties/[id]
export async function GET(_: Request, { params }: Params) {
  const { id } = await params
  const { data, error } = await supabase
    .from('property')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({
    ...data,
    image: normalizeImageSrc((data as Record<string, unknown>).image),
  })
}

// PATCH /api/properties/[id]
export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params
  const body = await req.json()

  if (body.content && !body.read_time) {
    const words = body.content.trim().split(/\s+/).length
    body.read_time = `${Math.max(1, Math.ceil(words / 200))} min read`
  }

  if (body.date && body.date.includes('-') && body.date.length === 10) {
    body.date = new Date(body.date + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  const { data, error } = await supabase
    .from('property')
    .update({
      ...body,
      ...(body.image !== undefined ? { image: normalizeImageSrc(body.image) } : {}),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/properties/[id] — unpublish
export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params
  const { error } = await supabase
    .from('property')
    .update({ published: false })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
