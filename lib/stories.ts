import { supabase } from '@/lib/supabase'

const STORY_IMAGE_FALLBACK = '/images/realestate.jpg'

function normalizeImageSrc(value: unknown): string {
  const raw = typeof value === 'string' ? value.trim() : ''
  if (!raw) return STORY_IMAGE_FALLBACK
  if (/\s/.test(raw)) return STORY_IMAGE_FALLBACK
  if (raw.startsWith('/')) return raw
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      new URL(raw)
      return raw
    } catch {
      return STORY_IMAGE_FALLBACK
    }
  }
  if (raw.startsWith('images/')) return `/${raw}`
  if (!raw.includes('/')) return `/images/${raw}`
  return STORY_IMAGE_FALLBACK
}

export type Story = {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  image: string
  date: string
  readTime: string   // matches existing codebase field name
  featured: boolean
  published: boolean
  created_at: string
  updated_at: string
}

// ── used by server components & static pages ─────────────────

export async function getAllStories(): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('getAllStories error:', error)
    return []
  }
  return (data ?? []).map(normalise)
}

export async function getStoryById(id: string): Promise<Story | undefined> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()

  if (error || !data) return undefined
  return normalise(data)
}

export async function getRelatedStories(
  currentId: string,
  category: string,
  limit = 3
): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .neq('id', currentId)
    .limit(limit)

  if (error) return []
  return (data ?? []).map(normalise)
}

export async function getFeaturedStory(): Promise<Story | undefined> {
  const { data } = await supabase
    .from('stories')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .single()

  return data ? normalise(data) : undefined
}

// ── DB row uses read_time, existing code uses readTime ────────
function normalise(row: Record<string, unknown>): Story {
  return {
    id:         row.id as string,
    title:      row.title as string,
    excerpt:    row.excerpt as string,
    content:    row.content as string,
    category:   row.category as string,
    image:      normalizeImageSrc(row.image),
    date:       row.date as string,
    readTime:   (row.read_time as string) || '5 min read',
    featured:   Boolean(row.featured),
    published:  Boolean(row.published),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  }
}

// ── kept so old imports don't break during transition ─────────
// (news/page.tsx still uses allStories synchronously — 
//  we update that page below to use async getAllStories instead)
export const allStories: Story[] = []
