import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

type Params = { params: Promise<{ id: string }> }

// GET /api/products/[id]
export async function GET(_: Request, { params }: Params) {
  const { id } = await params
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

// PATCH /api/products/[id]  — partial update
export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params
  const body = await req.json()

  // Recalculate price_zwg if price changed but zwg not explicitly set
  if (body.price !== undefined && body.price_zwg === undefined) {
    body.price_zwg = `ZWG ${(Number(body.price) * 300).toLocaleString()}`
  }

  const { data, error } = await supabase
    .from('products')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/products/[id]  — soft delete (mark out of stock)
export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params
  const { error } = await supabase
    .from('products')
    .update({ in_stock: false })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
