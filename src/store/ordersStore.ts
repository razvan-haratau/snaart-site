import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Order, OrderStatus } from '../types'

interface OrdersState {
  orders: Order[]
  isLoading: boolean
  error: string | null
  fetchOrders: () => Promise<void>
  addOrder: (order: Order) => Promise<{ ok: boolean; error?: string }>
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null })
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      set({ error: error.message, isLoading: false })
      return
    }
    set({ orders: (data as Order[]) ?? [], isLoading: false })
  },

  addOrder: async (order) => {
    const { data, error } = await supabase.from('orders').insert([order]).select().single()
    if (error) {
      return { ok: false, error: error.message }
    }
    if (data) {
      set((s) => ({ orders: [data as Order, ...s.orders] }))
    }
    return { ok: true }
  },

  updateOrderStatus: async (id, status) => {
    await supabase.from('orders').update({ order_status: status }).eq('id', id)
    set((s) => ({
      orders: s.orders.map((o) => (o.id === id ? { ...o, order_status: status } : o)),
    }))
  },
}))
