"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search, Plus, Eye, Edit3, Save, Trash2, Star, Package,
  Loader2, CheckCircle, AlertCircle, ArrowLeft, X, ShoppingBag,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────
type Product = {
  id: string
  name: string
  description: string
  price: number
  price_zwg: string
  image: string
  category: string
  in_stock: boolean
  featured: boolean
  created_at?: string
  updated_at?: string
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
type Mode = 'edit' | 'preview'

const CATEGORIES = ["Apparel", "Field Notes", "Artisan", "Support", "Books & Media", "Home & Living"]

const CAT_COLORS: Record<string, string> = {
  "Apparel":       "bg-emerald-100 text-emerald-800",
  "Field Notes":   "bg-blue-100 text-blue-800",
  "Artisan":       "bg-amber-100 text-amber-800",
  "Support":       "bg-purple-100 text-purple-800",
  "Books & Media": "bg-teal-100 text-teal-800",
  "Home & Living": "bg-rose-100 text-rose-800",
}

const emptyForm = () => ({
  name: '',
  description: '',
  price: '',
  price_zwg: '',
  image: '',
  category: '',
  in_stock: true,
  featured: false,
})

// ── Main component ────────────────────────────────────────────
export default function ProductManagerPage() {
  const [products, setProducts] = useState<Product[]>([])
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

  // ── Load products ───────────────────────────────────────────
  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products?all=1')
      const data: Product[] = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch {
      showToast('Failed to load products', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])

  // ── Toast ───────────────────────────────────────────────────
  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Select product ──────────────────────────────────────────
  function selectProduct(product: Product) {
    setSelectedId(product.id)
    setIsNew(false)
    setMode('edit')
    setForm({
      name:      product.name,
      description: product.description,
      price:     String(product.price),
      price_zwg: product.price_zwg || '',
      image:     product.image || '',
      category:  product.category,
      in_stock:  product.in_stock,
      featured:  product.featured,
    })
    setSaveStatus('idle')
    isDirty.current = false
    setMobileView('editor')
  }

  // ── New product ─────────────────────────────────────────────
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
    setForm(prev => {
      const next = { ...prev, [key]: value }
      // Auto-calculate ZWG when price changes (if zwg is empty or auto)
      if (key === 'price' && value && !isNaN(Number(value))) {
        next.price_zwg = `ZWG ${(Number(value) * 300).toLocaleString()}`
      }
      return next
    })
    isDirty.current = true
    setSaveStatus('idle')
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => {
      if (isDirty.current) handleSave(true)
    }, 3000)
  }

  // ── Save ────────────────────────────────────────────────────
  async function handleSave(silent = false) {
    if (!form.name.trim())          { showToast('Please enter a product name', 'error'); return }
    if (!form.category)             { showToast('Please select a category', 'error'); return }
    if (!form.price || isNaN(Number(form.price))) { showToast('Please enter a valid price', 'error'); return }
    if (!form.description.trim())   { showToast('Please write a description', 'error'); return }

    setSaveStatus('saving')
    isDirty.current = false

    const payload = {
      name:        form.name.trim(),
      description: form.description.trim(),
      price:     Number(form.price),
      price_zwg: form.price_zwg.trim() || `ZWG ${(Number(form.price) * 300).toLocaleString()}`,
      image:     form.image.trim() || '/images/product-placeholder.jpg',
      category:  form.category,
      in_stock:  form.in_stock,
      featured:  form.featured,
    }

    try {
      let res: Response
      if (isNew) {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch(`/api/products/${selectedId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      const saved: Product = await res.json()
      if (!res.ok) throw new Error((saved as unknown as { error: string }).error)

      setSaveStatus('saved')
      setIsNew(false)
      setSelectedId(saved.id)
      await loadProducts()
      if (!silent) showToast('💾 Saved!', 'success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (err) {
      setSaveStatus('error')
      showToast(`Save failed: ${(err as Error).message}`, 'error')
    }
  }

  // ── Archive (soft delete) ────────────────────────────────────
  async function handleDelete() {
    if (!selectedId) return
    try {
      await fetch(`/api/products/${selectedId}`, { method: 'DELETE' })
      setShowDeleteModal(false)
      setSelectedId(null)
      setIsNew(false)
      await loadProducts()
      showToast('Product archived', 'success')
    } catch {
      showToast('Archive failed', 'error')
    }
  }

  // ── Filtered list ────────────────────────────────────────────
  const visible = products.filter(p => {
    const matchCat = filterCat === 'all' || p.category === filterCat
    const q = search.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

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
          <Link href="/shop" className="flex items-center gap-1.5 text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to shop</span>
          </Link>
          <span className="hidden sm:inline text-primary-foreground/30">|</span>
          <span className="font-serif text-sm font-bold text-accent sm:text-base">🛍️ Product Manager</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/stories/manage"
            className="hidden sm:inline text-xs font-medium text-primary-foreground/60 hover:text-primary-foreground transition-colors"
          >
            ✍️ Stories
          </Link>
          <span className="hidden sm:inline rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
            {products.length} products
          </span>
          <button
            onClick={startNew}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground transition-all hover:bg-accent/90 sm:px-4 sm:py-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden xs:inline sm:inline">New Product</span>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">

        {/* ── Sidebar ── */}
        <aside className={`${mobileView === 'sidebar' ? 'flex' : 'hidden'} md:flex w-full md:w-72 shrink-0 flex-col border-r border-border bg-card`}>
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <select
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="all">All categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </div>
            ) : visible.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                No products found
              </div>
            ) : (
              visible.map(product => (
                <button
                  key={product.id}
                  onClick={() => selectProduct(product)}
                  className={`w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                    selectedId === product.id ? 'border-l-2 border-l-accent bg-accent/5' : 'border-l-2 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {product.image && (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-1.5">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${CAT_COLORS[product.category] || 'bg-gray-100 text-gray-700'}`}>
                          {product.category}
                        </span>
                        {product.featured && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                        {!product.in_stock && <span className="rounded bg-red-100 px-1.5 text-[10px] font-bold text-red-600">OUT</span>}
                      </div>
                      <p className="mb-0.5 line-clamp-1 text-sm font-semibold text-foreground">{product.name}</p>
                      <p className="text-xs font-bold text-accent">${product.price}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="border-t border-border p-3">
            <button
              onClick={startNew}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="h-4 w-4" /> Add new product
            </button>
          </div>
        </aside>

        {/* ── Editor / Preview ── */}
        <main className={`${mobileView === 'editor' ? 'flex' : 'hidden'} md:flex flex-1 flex-col overflow-hidden`}>
          {!hasSelection ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
              <div className="text-6xl opacity-20">🛍️</div>
              <h2 className="font-serif text-2xl font-bold text-foreground">Select or add a product</h2>
              <p className="max-w-xs text-sm text-muted-foreground">
                Choose an existing product from the panel on the left, or add a new one.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setMobileView('sidebar')}
                  className="flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-semibold text-foreground hover:bg-muted md:hidden"
                >
                  <ArrowLeft className="h-4 w-4" /> Browse Products
                </button>
                <button onClick={startNew} className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground hover:bg-accent/90">
                  <Plus className="h-4 w-4" /> Add your first product
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border bg-card px-3 py-2 sm:px-5 sm:py-2.5">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setMobileView('sidebar')}
                    className="flex md:hidden items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> List
                  </button>
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
                    onClick={() => handleSave(false)}
                    disabled={saveStatus === 'saving'}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 sm:px-4"
                  >
                    <Package className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{isNew ? 'Add to Shop' : 'Update Product'}</span>
                    <span className="sm:hidden">{isNew ? 'Add' : 'Update'}</span>
                  </button>
                </div>
              </div>

              {/* ── EDIT MODE ── */}
              {mode === 'edit' && (
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <div className="mx-auto max-w-2xl space-y-5">

                    {/* Name */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Product Name <span className="text-accent">*</span>
                      </label>
                      <input
                        value={form.name}
                        onChange={e => updateForm('name', e.target.value)}
                        placeholder="e.g. Ranger Field Cap"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 font-serif text-xl font-bold text-foreground outline-none placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    {/* Category + Price row */}
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
                          <option value="">Select…</option>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Price (USD) <span className="text-accent">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.price}
                          onChange={e => updateForm('price', e.target.value)}
                          placeholder="25.00"
                          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Price (ZWG)
                        </label>
                        <input
                          value={form.price_zwg}
                          onChange={e => updateForm('price_zwg', e.target.value)}
                          placeholder="ZWG 7,500"
                          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Description <span className="text-accent">*</span>
                        <span className="ml-2 font-normal normal-case text-muted-foreground/60">shown on product card</span>
                      </label>
                      <textarea
                        value={form.description}
                        onChange={e => updateForm('description', e.target.value)}
                        placeholder="A short, compelling product description…"
                        rows={4}
                        className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Product Image URL
                      </label>
                      <div className="flex gap-3">
                        {/^(\/|https?:\/\/).+/.test(form.image) && (
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border">
                            <Image src={form.image} alt="preview" fill className="object-cover" onError={() => {}} />
                          </div>
                        )}
                        <input
                          value={form.image}
                          onChange={e => updateForm('image', e.target.value)}
                          placeholder="/images/product-myitem.jpg  or  https://…"
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
                          <Star className="h-4 w-4 text-amber-400" /> Featured product
                        </span>
                      </label>

                      <label className="flex cursor-pointer items-center gap-3">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={form.in_stock}
                          onClick={() => updateForm('in_stock', !form.in_stock)}
                          className={`relative h-6 w-11 rounded-full transition-colors ${form.in_stock ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                        >
                          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.in_stock ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                        <span className="flex items-center gap-1.5 text-sm font-medium">
                          <Package className="h-4 w-4 text-primary" /> In stock
                        </span>
                      </label>
                    </div>

                  </div>
                </div>
              )}

              {/* ── PREVIEW MODE ── */}
              {mode === 'preview' && (
                <div className="flex-1 overflow-y-auto p-8">
                  <div className="mx-auto max-w-xs">
                    <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">Shop card preview</p>
                    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                      <div className="relative h-64 overflow-hidden bg-muted">
                        {form.image ? (
                          <Image src={form.image} alt={form.name || 'Product'} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                        )}
                        {form.category && (
                          <div className="absolute top-4 left-4">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${CAT_COLORS[form.category] || 'bg-gray-100 text-gray-700'}`}>
                              {form.category}
                            </span>
                          </div>
                        )}
                        {form.featured && (
                          <div className="absolute top-4 right-4">
                            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
                              <Star className="h-3 w-3 fill-amber-500" /> Featured
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="mb-1 font-serif text-lg font-bold text-foreground">
                          {form.name || 'Product name…'}
                        </h3>
                        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                          {form.description || 'Product description…'}
                        </p>
                        <div className="mb-4">
                          <span className="text-xl font-bold text-accent">
                            {form.price ? `$${Number(form.price).toFixed(2)}` : '$0.00'}
                          </span>
                          {form.price_zwg && (
                            <span className="ml-2 text-xs text-muted-foreground">({form.price_zwg})</span>
                          )}
                        </div>
                        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 font-semibold text-accent-foreground">
                          <ShoppingBag className="h-4 w-4" /> Add to Cart
                        </button>
                        {!form.in_stock && (
                          <p className="mt-2 text-center text-xs font-semibold text-red-500">Out of stock</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Archive modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-background p-8 shadow-2xl">
            <div className="mb-4 text-center text-5xl">📦</div>
            <h3 className="mb-2 text-center font-serif text-xl font-bold">Archive this product?</h3>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              The product will be marked out-of-stock and hidden from the shop. You can restore it from your database at any time.
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
