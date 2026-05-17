import { create } from 'zustand'
import { supabase, supabaseConfigured } from '../lib/supabase'

interface AuthState {
  isAuthenticated: boolean
  loading: boolean
  initSession: () => Promise<void>
  login: (email: string, pass: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  loading: true,

  initSession: async () => {
    if (!supabaseConfigured) {
      set({ isAuthenticated: false, loading: false })
      return
    }
    const { data } = await supabase.auth.getSession()
    set({ isAuthenticated: !!data.session, loading: false })
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ isAuthenticated: !!session })
    })
  },

  login: async (email, pass) => {
    if (!supabaseConfigured) {
      if (email === 'admin@snaart.ro' && pass === 'admin') {
        set({ isAuthenticated: true })
        return { ok: true }
      }
      return { ok: false, error: 'Email sau parolă incorectă.' }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) {
      const msg = error.message.includes('Invalid login credentials')
        ? 'Email sau parolă incorectă.'
        : error.message
      return { ok: false, error: msg }
    }
    set({ isAuthenticated: true })
    return { ok: true }
  },

  logout: async () => {
    if (supabaseConfigured) await supabase.auth.signOut()
    set({ isAuthenticated: false })
  },
}))
