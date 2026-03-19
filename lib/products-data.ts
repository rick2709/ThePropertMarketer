// Static fallback product data — no Supabase import, safe to use in client components.
export type Product = {
  id: string
  name: string
  description: string
  price: number
  price_zwg: string
  image: string
  category: string
  in_stock: boolean
  featured: boolean
  created_at: string
  updated_at: string
}

export const staticProducts: Product[] = [
  {
    id: 'wildlife-tshirt',
    name: 'Wear the Story',
    description: "Apparel featuring original artwork from conservationists and community artists we've profiled. Wear a piece of the story.",
    price: 25,
    price_zwg: 'ZWG 7,500',
    image: '/images/product-tshirt.jpg',
    category: 'Apparel',
    in_stock: true,
    featured: false,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'leather-journal',
    name: 'Field Notes Journal',
    description: 'Unique notebooks, prints, and stationery featuring photography and sketches from our contributors in the field.',
    price: 35,
    price_zwg: 'ZWG 10,500',
    image: '/images/product-journal.jpg',
    category: 'Field Notes',
    in_stock: true,
    featured: false,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'tote-bag',
    name: 'Artisan of the Wild Tote',
    description: 'Beautiful, ethically sourced crafts and goods made by communities whose stories we tell. Your purchase supports local livelihoods.',
    price: 18,
    price_zwg: 'ZWG 5,400',
    image: '/images/product-tote.jpg',
    category: 'Artisan',
    in_stock: true,
    featured: false,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'bush-bottle',
    name: 'Conservation Compass Bottle',
    description: 'Stainless steel, branded with The Conservation Compass logo. Perfect for field expeditions.',
    price: 22,
    price_zwg: 'ZWG 6,600',
    image: '/images/product-bottle.jpg',
    category: 'Field Notes',
    in_stock: true,
    featured: false,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'ranger-cap',
    name: 'Ranger Field Cap',
    description: 'Durable khaki field cap designed for outdoor adventures. UV-protective fabric.',
    price: 20,
    price_zwg: 'ZWG 6,000',
    image: '/images/product-cap.jpg',
    category: 'Apparel',
    in_stock: true,
    featured: false,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'ranger-pack',
    name: 'Support a Storyteller Pack',
    description: 'Make a direct contribution to our fellowship fund or a specific reporting project. Help us train the next generation of environmental communicators.',
    price: 50,
    price_zwg: 'ZWG 15,000',
    image: '/images/product-pack.jpg',
    category: 'Support',
    in_stock: true,
    featured: false,
    created_at: '',
    updated_at: '',
  },
]
