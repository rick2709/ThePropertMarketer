// Server-only module — imports supabase (service key). Never import this in client components.
// For client components, import from '@/lib/products-data' instead.
import { supabase } from '@/lib/supabase'
export type { Product } from '@/lib/products-data'
export { staticProducts } from '@/lib/products-data'
import type { Product } from '@/lib/products-data'
import { staticProducts } from '@/lib/products-data'

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getAllProducts error:', error)
    return staticProducts
  }
  return (data ?? staticProducts) as Product[]
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return staticProducts.find(p => p.id === id)
  return data as Product
}
