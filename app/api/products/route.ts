import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/products  — all in-stock products (optionally filter by category / featured)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const featured  = searchParams.get('featured')
  const all       = searchParams.get('all') // admin: include out-of-stock

  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (!all) query = query.eq('in_stock', true)
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
            ? 'Create the "products" table: run supabase/products-table.sql in Supabase → SQL Editor'
            : undefined,
      },
      { status: 500 }
    )
  }
  return NextResponse.json(data ?? [])
}

// POST /api/products  — create a new product
export async function POST(req: Request) {
  const body = await req.json()
  const { name, description, price, price_zwg, image, category, in_stock, featured } = body

  if (!name || !description || !price || !category) {
    return NextResponse.json(
      { error: 'name, description, price and category are required' },
      { status: 400 }
    )
  }

  // Build a slug-style id from name
  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60) + '-' + Date.now().toString(36)

  const { data, error } = await supabase
    .from('products')
    .insert({
      id,
      name,
      description,
      price: Number(price),
      price_zwg: price_zwg || `ZWG ${(Number(price) * 300).toLocaleString()}`,
      image: image || '/images/product-placeholder.jpg',
      category,
      in_stock: in_stock ?? true,
      featured: featured ?? false,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
