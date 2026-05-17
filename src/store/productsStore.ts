import { create } from 'zustand'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { MOCK_PRODUCTS } from '../lib/mockData'
import type { Product } from '../types'

interface ProductsState {
  products: Product[]
  isLoading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateProduct: (id: string, partial: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  decrementStock: (productId: string, qty: number) => Promise<void>
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null })
    if (!supabaseConfigured) {
      set({ products: MOCK_PRODUCTS, isLoading: false })
      return
    }
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      set({ products: MOCK_PRODUCTS, isLoading: false })
      return
    }
    set({ products: (data as Product[]) ?? [], isLoading: false })
  },

  addProduct: async (product) => {
    if (!supabaseConfigured) {
      const mock: Product = { ...product, id: `mock-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      set((s) => ({ products: [mock, ...s.products] }))
      return
    }
    const { data, error } = await supabase.from('products').insert([product]).select().single()
    if (!error && data) {
      set((s) => ({ products: [data as Product, ...s.products] }))
    }
  },

  updateProduct: async (id, partial) => {
    if (!supabaseConfigured) {
      set((s) => ({ products: s.products.map((p) => p.id === id ? { ...p, ...partial } : p) }))
      return
    }
    const { data, error } = await supabase
      .from('products')
      .update({ ...partial, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (!error && data) {
      set((s) => ({ products: s.products.map((p) => (p.id === id ? (data as Product) : p)) }))
    }
  },

  deleteProduct: async (id) => {
    if (!supabaseConfigured) {
      set((s) => ({ products: s.products.filter((p) => p.id !== id) }))
      return
    }
    await supabase.from('products').delete().eq('id', id)
    set((s) => ({ products: s.products.filter((p) => p.id !== id) }))
  },

  decrementStock: async (productId, qty) => {
    const product = get().products.find((p) => p.id === productId)
    if (!product) return
    const newQty = Math.max(0, product.stock_qty - qty)
    const newStatus = newQty === 0 ? 'out_of_stock' : product.status
    await get().updateProduct(productId, { stock_qty: newQty, status: newStatus })
  },
}))
