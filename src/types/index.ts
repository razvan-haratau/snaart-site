export type ProductCategory = 'Abstract Gold' | 'Neutral Collection' | 'Textured Art' | 'Custom Works'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  compare_price?: number
  show_compare_price?: boolean
  sku: string
  stock_qty: number
  category: ProductCategory
  dimensions: string
  technique: string
  surface: string
  images: string[]
  status: 'active' | 'draft' | 'out_of_stock'
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export type OrderStatus = 'Nouă' | 'În procesare' | 'Expediată' | 'Livrată' | 'Anulată'

export interface ShippingAddress {
  name: string
  street: string
  city: string
  county: string
  postal_code: string
  country: string
}

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customer_email: string
  customer_name: string
  customer_phone: string
  shipping_address: ShippingAddress
  items: OrderItem[]
  total: number
  shipping_cost: number
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  order_status: OrderStatus
  payment_method: 'card' | 'ramburs'
  netopia_ntpid?: string
  created_at: string
}

export interface Customer {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  created_at: string
}

export interface StoreSettings {
  storeName: string
  email: string
  phone: string
  whatsapp: string
  address: string
  instagramUrl: string
  facebookUrl: string
  freeShippingThreshold: number
  shippingCost: number
  currency: string
}
