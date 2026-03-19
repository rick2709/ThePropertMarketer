import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const STORY_IMAGE_FALLBACK = '/images/realestate.jpg'

function normalizeImageSrc(value: unknown): string {
  const raw = typeof value === 'string' ? value.trim() : ''
  if (!raw) return STORY_IMAGE_FALLBACK
  if (raw.startsWith('/')) return raw
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  if (raw.startsWith('images/')) return `/${raw}`
  if (!raw.includes('/')) return `/images/${raw}`
  return STORY_IMAGE_FALLBACK
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  } catch {
    return new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }
}

// GET /api/stories  — returns all published stories
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const featured  = searchParams.get('featured')

  let query = supabase
    .from('stories')
    .select('*')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  if (category) query = query.eq('category', category)
  if (featured)  query = query.eq('featured', true)

  const { data, error } = await query

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        hint:
          error.code === '42P01'
            ? 'Create the "stories" table: run supabase/stories-table.sql in Supabase → SQL Editor'
            : undefined,
      },
      { status: 500 }
    )
  }
  return NextResponse.json(
    (data ?? []).map((row) => ({
      ...row,
      image: normalizeImageSrc((row as Record<string, unknown>).image),
    })),
  )
}

// POST /api/stories  — create a new story
export async function POST(req: Request) {
  const body = await req.json()
  const { title, excerpt, content, category, image, date, featured, published } = body

  if (!title || !excerpt || !content || !category) {
    return NextResponse.json(
      { error: 'title, excerpt, content and category are required' },
      { status: 400 }
    )
  }

  // Auto-generate slug-style id from title + short timestamp
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
  const id = `${baseSlug}-${Date.now().toString(36)}`

  const { data, error } = await supabase
    .from('stories')
    .insert({
      id,
      title,
      excerpt,
      content,
      category,
      image: normalizeImageSrc(image),
      date: date ? formatDate(date) : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read_time: estimateReadTime(content),
      featured: featured ?? false,
      published: published ?? true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
