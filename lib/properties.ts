// Properties = listings (stands, Airbnb, developments, land, etc.). Stored in Supabase "property" table.
import { supabase } from '@/lib/supabase'

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

export type Property = {
  id: string
  title: string
  excerpt: string
  content: string
  category: string  // property type: Stand, Airbnb, Land Development, etc.
  image: string
  date: string
  readTime: string
  featured: boolean
  published: boolean
  created_at: string
  updated_at: string
}

export async function getAllProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('property')
    .select('*')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('getAllProperties error:', error)
    return []
  }
  return (data ?? []).map(normalise)
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  const { data, error } = await supabase
    .from('property')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()

  if (error || !data) return undefined
  return normalise(data)
}

export async function getRelatedProperties(
  currentId: string,
  category: string,
  limit = 3
): Promise<Property[]> {
  const { data, error } = await supabase
    .from('property')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .neq('id', currentId)
    .limit(limit)

  if (error) return []
  return (data ?? []).map(normalise)
}

export async function getFeaturedProperty(): Promise<Property | undefined> {
  const { data } = await supabase
    .from('property')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .single()

  return data ? normalise(data) : undefined
}

function normalise(row: Record<string, unknown>): Property {
  return {
    id:         row.id as string,
    title:      row.title as string,
    excerpt:    row.excerpt as string,
    content:    row.content as string,
    category:   row.category as string,
    image:      normalizeImageSrc(row.image),
    date:       row.date as string,
    readTime:   (row.read_time as string) || '—',
    featured:   Boolean(row.featured),
    published:  Boolean(row.published),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  }
}
