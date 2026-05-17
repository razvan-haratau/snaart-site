import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'

export default function AdminLogin() {
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email.trim(), pass)
    setLoading(false)
    if (!result.ok) {
      setError(result.error ?? 'Credențiale incorecte.')
      setPass('')
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-serif text-3xl tracking-[0.3em] text-charcoal">SNAART</p>
          <p className="text-[9px] tracking-[0.4em] text-gold uppercase mt-1">Art with Soul</p>
          <span className="inline-block mt-4 text-xs font-sans tracking-widest uppercase text-brand-muted bg-cream-darker px-3 py-1">
            Panou administrare
          </span>
        </div>

        <div className="bg-white border border-cream-darker p-8">
          <p className="font-serif text-xl font-light text-charcoal mb-6">Autentificare</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded px-4 py-3 mb-5">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@snaart.ro"
                  className="w-full pl-10 pr-4 py-3 border border-cream-darker text-sm outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Parolă</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-cream-darker text-sm outline-none focus:border-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-charcoal"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : null}
              {loading ? 'Se verifică...' : 'Intră în cont'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-brand-muted/60 mt-6 tracking-wider">
          Acces restricționat — doar personal autorizat
        </p>
      </div>
    </div>
  )
}
