"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search, Plus, Eye, Edit3, Save, Trash2, Star, Globe,
  Clock, Loader2, CheckCircle, AlertCircle, ArrowLeft, X
} from "lucide-react"
import { RichTextEditor } from "@/components/rich-text-editor"

// ── Types ─────────────────────────────────────────────────────
type Story = {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  image: string
  date: string
  read_time: string
  featured: boolean
  published: boolean
  created_at?: string
  updated_at?: string
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
type Mode = 'edit' | 'preview'

const CATEGORIES = [
  "Biodiversity & Wildlife",
  "Climate & Energy",
  "Food & Agriculture",
  "Extractives & Industry",
  "Forests, Water & Oceans",
  "People, Culture & Community Voices",
  "Analysis & Policy",
  "Solutions & Action",
  "Community Stories",
]

const CAT_COLORS: Record<string, string> = {
  "Biodiversity & Wildlife":           "bg-emerald-100 text-emerald-800",
  "Climate & Energy":                  "bg-blue-100 text-blue-800",
  "Food & Agriculture":                "bg-lime-100 text-lime-800",
  "Extractives & Industry":            "bg-orange-100 text-orange-800",
  "Forests, Water & Oceans":           "bg-teal-100 text-teal-800",
  "People, Culture & Community Voices":"bg-purple-100 text-purple-800",
  "Analysis & Policy":                 "bg-violet-100 text-violet-800",
  "Solutions & Action":                "bg-amber-100 text-amber-800",
  "Community Stories":                 "bg-rose-100 text-rose-800",
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

function formatDateForInput(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0]
    return d.toISOString().split('T')[0]
  } catch { return new Date().toISOString().split('T')[0] }
}

function formatDateForDisplay(dateInput: string): string {
  try {
    const d = new Date(dateInput + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return dateInput }
}

/** Sort stories by date descending (newest first) for the sidebar list. */
function sortStoriesByDate(list: Story[]): Story[] {
  return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// ── Empty form state ─────────────────────────────────────────
const emptyForm = () => ({
  title: '', excerpt: '', content: '',
  category: '', image: '',
  date: new Date().toISOString().split('T')[0],
  featured: false, published: true,
})

// ── Main component ────────────────────────────────────────────
export default function StoryManagerPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [mode, setMode] = useState<Mode>('edit')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [form, setForm] = useState(emptyForm())
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDirty = useRef(false)
  const [mobileView, setMobileView] = useState<'sidebar' | 'editor'>('sidebar')

  // ── Toast (stable ref to avoid triggering loadStories effect) ──
  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  // ── Load stories (run once on mount only) ─────────────────────
  const loadStories = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stories')
      const data: Story[] = await res.json()
      setStories(sortStoriesByDate(data))
    } catch {
      setToast({ msg: 'Failed to load stories', type: 'error' })
      setTimeout(() => setToast(null), 3500)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Select story ────────────────────────────────────────────
  function selectStory(story: Story) {
    setSelectedId(story.id)
    setIsNew(false)
    setMode('edit')
    setForm({
      title:     story.title,
      excerpt:   story.excerpt,
      content:   story.content,
      category:  story.category,
      image:     story.image || '',
      date:      formatDateForInput(story.date),
      featured:  story.featured,
      published: story.published,
    })
    setSaveStatus('idle')
    isDirty.current = false
    setMobileView('editor')
  }

  // ── New story ────────────────────────────────────────────────
  function startNew() {
    setSelectedId(null)
    setIsNew(true)
    setMode('edit')
    setForm(emptyForm())
    setSaveStatus('idle')
    isDirty.current = false
    setMobileView('editor')
  }

  // ── Form change ──────────────────────────────────────────────
  function updateForm(key: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [key]: value }))
    isDirty.current = true
    setSaveStatus('idle')
    // Auto-save after 3s of inactivity
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => {
      if (isDirty.current) handleSave(false, true)
    }, 3000)
  }

  // ── Save ────────────────────────────────────────────────────
  async function handleSave(andPublish = false, silent = false) {
    if (!form.title.trim()) { showToast('Please enter a title', 'error'); return }
    if (!form.category)     { showToast('Please select a category', 'error'); return }
    if (!form.content.trim()){ showToast('Please add some content', 'error'); return }
    if (!form.excerpt.trim()){ showToast('Please write an excerpt', 'error'); return }

    setSaveStatus('saving')
    isDirty.current = false

    const payload = {
      title:     form.title.trim(),
      excerpt:   form.excerpt.trim(),
      content:   form.content,
      category:  form.category,
      image:     form.image.trim() || '/images/realestate.jpg',
      date:      form.date,
      read_time: estimateReadTime(form.content),
      featured:  form.featured,
      published: andPublish ? true : form.published,
    }

    try {
      const res = await fetch(isNew ? '/api/stories' : `/api/stories/${selectedId}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const saved: Story = await res.json()
      if (!res.ok) throw new Error((saved as unknown as { error: string }).error)

      setSaveStatus('saved')
      setIsNew(false)
      setSelectedId(saved.id)
      if (isNew) {
        setStories(prev => sortStoriesByDate([saved, ...prev]))
      } else {
        setStories(prev => sortStoriesByDate(prev.map(s => s.id === saved.id ? saved : s)))
      }
      if (!silent) showToast(andPublish ? '✓ Published!' : '💾 Saved!', 'success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (err) {
      setSaveStatus('error')
      showToast(`Save failed: ${(err as Error).message}`, 'error')
    }
  }

  // ── Delete ───────────────────────────────────────────────────
  async function handleDelete() {
    if (!selectedId) return
    const idToRemove = selectedId
    try {
      await fetch(`/api/stories/${idToRemove}`, { method: 'DELETE' })
      setShowDeleteModal(false)
      setSelectedId(null)
      setIsNew(false)
      setStories(prev => prev.filter(s => s.id !== idToRemove))
      showToast('Story archived', 'success')
    } catch {
      showToast('Delete failed', 'error')
    }
  }

  // ── Filtered list ────────────────────────────────────────────
  const visibleStories = stories.filter(s => {
    const matchCat = filterCat === 'all' || s.category === filterCat
    const q = search.toLowerCase()
    const matchSearch = !q || s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length
  const readTime = estimateReadTime(form.content)
  const hasSelection = !!selectedId || isNew

  // ── Status indicator ─────────────────────────────────────────
  const StatusIcon = () => {
    if (saveStatus === 'saving') return <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
    if (saveStatus === 'saved')  return <CheckCircle className="h-3.5 w-3.5 text-green-600" />
    if (saveStatus === 'error')  return <AlertCircle className="h-3.5 w-3.5 text-red-500" />
    return <div className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/30" />
  }
  const statusLabel = { idle: 'Unsaved', saving: 'Saving…', saved: 'Saved', error: 'Error' }[saveStatus]

  // ── Keyboard shortcut ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (hasSelection) handleSave()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [hasSelection, form, selectedId, isNew])

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background font-sans">

      {/* ── Top bar ── */}
      <header className="flex h-auto min-h-14 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border bg-primary px-3 py-2 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/news" className="flex items-center gap-1.5 text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to site</span>
          </Link>
          <span className="hidden sm:inline text-primary-foreground/30">|</span>
          <span className="font-serif text-sm font-bold text-accent sm:text-base">🧭 Story Manager</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
            {stories.length} stories
          </span>
          <button
            onClick={startNew}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground transition-all hover:bg-accent/90 sm:px-4 sm:py-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Story</span>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">

        {/* ── Sidebar ── */}
        <aside className={`${mobileView === 'sidebar' ? 'flex' : 'hidden'} md:flex w-full md:w-72 shrink-0 flex-col border-r border-border bg-card`}>
          {/* Search */}
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search stories…"
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
            {/* Category filter */}
            <select
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="all">All categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </div>
            ) : visibleStories.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                No stories found
              </div>
            ) : (
              visibleStories.map(story => (
                <button
                  key={story.id}
                  onClick={() => selectStory(story)}
                  className={`w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                    selectedId === story.id ? 'border-l-2 border-l-accent bg-accent/5' : 'border-l-2 border-l-transparent'
                  }`}
                >
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${CAT_COLORS[story.category] || 'bg-gray-100 text-gray-700'}`}>
                      {story.category.split(' ')[0]}
                    </span>
                    {story.featured && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                    {!story.published && <span className="rounded bg-red-100 px-1.5 text-[10px] font-bold text-red-600">DRAFT</span>}
                  </div>
                  <p className="mb-1 line-clamp-2 text-sm font-semibold leading-snug text-foreground">{story.title}</p>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{story.date}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{story.read_time}</span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* New story button */}
          <div className="border-t border-border p-3">
            <button
              onClick={startNew}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="h-4 w-4" /> Write a new story
            </button>
          </div>
        </aside>

        {/* ── Editor / Preview ── */}
        <main className={`${mobileView === 'editor' ? 'flex' : 'hidden'} md:flex flex-1 flex-col overflow-hidden`}>
          {!hasSelection ? (
            /* Empty state */
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
              <div className="text-6xl opacity-20">📖</div>
              <h2 className="font-serif text-2xl font-bold text-foreground">Select or create a story</h2>
              <p className="max-w-xs text-sm text-muted-foreground">
                Choose an existing story from the panel on the left, or start writing a new one.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setMobileView('sidebar')}
                  className="flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-semibold text-foreground hover:bg-muted md:hidden"
                >
                  <ArrowLeft className="h-4 w-4" /> Browse Stories
                </button>
                <button onClick={startNew} className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground hover:bg-accent/90">
                  <Plus className="h-4 w-4" /> Write your first story
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Editor toolbar */}
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border bg-card px-3 py-2 sm:px-5 sm:py-2.5">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setMobileView('sidebar')}
                    className="flex md:hidden items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> List
                  </button>
                  {/* Edit / Preview toggle */}
                  <div className="flex rounded-lg border border-border bg-muted p-0.5">
                    <button
                      onClick={() => setMode('edit')}
                      className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition-all sm:px-3 ${mode === 'edit' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setMode('preview')}
                      className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition-all sm:px-3 ${mode === 'preview' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      <Eye className="h-3.5 w-3.5" /> Preview
                    </button>
                  </div>
                  {/* Save status */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <StatusIcon />
                    <span className="hidden sm:inline">{statusLabel}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  {!isNew && (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs font-semibold text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground sm:px-3"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Archive</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleSave(false)}
                    disabled={saveStatus === 'saving'}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-semibold transition-all hover:bg-muted disabled:opacity-50 sm:px-3"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Save <span className="text-muted-foreground">(⌘S)</span></span>
                  </button>
                  <button
                    onClick={() => handleSave(true)}
                    disabled={saveStatus === 'saving'}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 sm:px-4"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{isNew ? 'Publish' : 'Update & Publish'}</span>
                    <span className="sm:hidden">{isNew ? 'Publish' : 'Update'}</span>
                  </button>
                </div>
              </div>

              {/* ── EDIT MODE ── */}
              {mode === 'edit' && (
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <div className="mx-auto max-w-3xl space-y-5">

                    {/* Title */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Title <span className="text-accent">*</span>
                      </label>
                      <input
                        value={form.title}
                        onChange={e => updateForm('title', e.target.value)}
                        placeholder="Enter a compelling headline…"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 font-serif text-xl font-bold text-foreground outline-none placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    {/* Category + Date + Featured row */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Category <span className="text-accent">*</span>
                        </label>
                        <select
                          value={form.category}
                          onChange={e => updateForm('category', e.target.value)}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                        >
                          <option value="">Select category…</option>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Publish Date
                        </label>
                        <input
                          type="date"
                          value={form.date}
                          onChange={e => updateForm('date', e.target.value)}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Read Time
                        </label>
                        <div className="flex h-10 items-center rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground">
                          {readTime}
                        </div>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Excerpt <span className="text-accent">*</span>
                        <span className="ml-2 font-normal normal-case text-muted-foreground/60">shown on story cards</span>
                      </label>
                      <textarea
                        value={form.excerpt}
                        onChange={e => updateForm('excerpt', e.target.value)}
                        placeholder="A compelling 1–2 sentence summary…"
                        rows={3}
                        className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Content <span className="text-accent">*</span>
                      </label>
                      <RichTextEditor
                        value={form.content}
                        onChange={(html) => updateForm("content", html)}
                        placeholder="Write your story here…"
                      />
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Cover Image URL
                      </label>
                      <div className="flex gap-3">
                        {/^(\/|https?:\/\/).+/.test(form.image) && (
                          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border">
                            <Image src={form.image} alt="preview" fill className="object-cover" onError={() => {}} />
                          </div>
                        )}
                        <input
                          value={form.image}
                          onChange={e => updateForm('image', e.target.value)}
                          placeholder="/images/realestate.jpg  or  https://…"
                          className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4 sm:gap-8">
                      <label className="flex cursor-pointer items-center gap-3">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={form.featured}
                          onClick={() => updateForm('featured', !form.featured)}
                          className={`relative h-6 w-11 rounded-full transition-colors ${form.featured ? 'bg-amber-400' : 'bg-muted-foreground/30'}`}
                        >
                          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                        <span className="flex items-center gap-1.5 text-sm font-medium">
                          <Star className="h-4 w-4 text-amber-400" /> Featured story
                        </span>
                      </label>

                      <label className="flex cursor-pointer items-center gap-3">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={form.published}
                          onClick={() => updateForm('published', !form.published)}
                          className={`relative h-6 w-11 rounded-full transition-colors ${form.published ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                        >
                          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.published ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                        <span className="flex items-center gap-1.5 text-sm font-medium">
                          <Globe className="h-4 w-4 text-primary" /> Published
                        </span>
                      </label>
                    </div>

                  </div>
                </div>
              )}

              {/* ── PREVIEW MODE ── */}
              {mode === 'preview' && (
                <div className="flex-1 overflow-y-auto">
                  {/* Hero */}
                  <div className="relative flex min-h-[280px] items-end bg-primary">
                    {form.image && (
                      <Image src={form.image} alt={form.title || 'Preview'} fill className="object-cover opacity-40" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
                    <div className="relative z-10 max-w-3xl px-4 pb-8 pt-16 sm:px-8 sm:pb-10 sm:pt-20">
                      {form.category && (
                        <span className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${CAT_COLORS[form.category] || 'bg-accent/20 text-accent'}`}>
                          {form.category}
                        </span>
                      )}
                      <h1 className="mb-4 font-serif text-3xl font-bold leading-tight text-primary-foreground">
                        {form.title || 'Your story title…'}
                      </h1>
                      <div className="flex items-center gap-4 text-sm text-primary-foreground/70">
                        <span>{form.date ? formatDateForDisplay(form.date) : 'Date'}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{readTime}</span>
                        {form.featured && <span className="flex items-center gap-1 text-amber-300"><Star className="h-3.5 w-3.5 fill-current" /> Featured</span>}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-10">
                    {form.excerpt && (
                      <p className="mb-8 border-l-4 border-accent pl-5 font-serif text-lg font-medium italic leading-relaxed text-foreground">
                        {form.excerpt}
                      </p>
                    )}
                    <div
                      dangerouslySetInnerHTML={{ __html: form.content || '<p>Start writing your content…</p>' }}
                      className="prose prose-lg prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-accent prose-blockquote:text-muted-foreground prose-strong:text-foreground max-w-none [&_div[data-youtube-video]]:relative [&_div[data-youtube-video]]:w-full [&_div[data-youtube-video]]:pb-[56.25%] [&_div[data-youtube-video]]:h-0 [&_div[data-youtube-video]]:overflow-hidden [&_div[data-youtube-video]]:rounded-xl [&_div[data-youtube-video]]:my-6 [&_div[data-youtube-video]_iframe]:absolute [&_div[data-youtube-video]_iframe]:inset-0 [&_div[data-youtube-video]_iframe]:w-full [&_div[data-youtube-video]_iframe]:h-full"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Delete modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-background p-8 shadow-2xl">
            <div className="mb-4 text-center text-5xl">🗄️</div>
            <h3 className="mb-2 text-center font-serif text-xl font-bold">Archive this story?</h3>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              The story will be unpublished and hidden from the site. You can restore it from your database at any time.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-lg border border-border py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3.5 text-sm font-semibold text-white shadow-2xl transition-all ${toast.type === 'success' ? 'bg-primary' : 'bg-destructive'}`}>
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
          <button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

    </div>
  )
}
