import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { StoreSettings } from '../types'

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'SNAART',
  email: 'hello@snaart.ro',
  phone: '0755.184.334',
  whatsapp: '0755184334',
  address: 'România',
  instagramUrl: 'https://www.instagram.com/snaart2026/',
  facebookUrl: 'https://facebook.com/snaart',
  freeShippingThreshold: 500,
  shippingCost: 30,
  currency: 'RON',
}

interface SettingsState {
  settings: StoreSettings
  isLoading: boolean
  fetchSettings: () => Promise<void>
  updateSettings: (partial: Partial<StoreSettings>) => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoading: false,

  fetchSettings: async () => {
    set({ isLoading: true })
    const { data, error } = await supabase.from('settings').select('*').single()
    if (!error && data) {
      set({
        settings: {
          storeName: data.store_name ?? DEFAULT_SETTINGS.storeName,
          email: data.email ?? DEFAULT_SETTINGS.email,
          phone: data.phone ?? DEFAULT_SETTINGS.phone,
          whatsapp: data.whatsapp ?? DEFAULT_SETTINGS.whatsapp,
          address: data.address ?? DEFAULT_SETTINGS.address,
          instagramUrl: data.instagram_url ?? DEFAULT_SETTINGS.instagramUrl,
          facebookUrl: data.facebook_url ?? DEFAULT_SETTINGS.facebookUrl,
          freeShippingThreshold: data.free_shipping_threshold ?? DEFAULT_SETTINGS.freeShippingThreshold,
          shippingCost: data.shipping_cost ?? DEFAULT_SETTINGS.shippingCost,
          currency: data.currency ?? DEFAULT_SETTINGS.currency,
        },
      })
    }
    set({ isLoading: false })
  },

  updateSettings: async (partial) => {
    const current = get().settings
    const updated = { ...current, ...partial }
    set({ settings: updated })
    await supabase.from('settings').update({
      store_name: updated.storeName,
      email: updated.email,
      phone: updated.phone,
      whatsapp: updated.whatsapp,
      address: updated.address,
      instagram_url: updated.instagramUrl,
      facebook_url: updated.facebookUrl,
      free_shipping_threshold: updated.freeShippingThreshold,
      shipping_cost: updated.shippingCost,
      currency: updated.currency,
      updated_at: new Date().toISOString(),
    }).eq('id', 1)
  },
}))
