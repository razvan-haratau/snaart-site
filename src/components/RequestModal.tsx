import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'
import { useOrdersStore } from '../store/ordersStore'
import { isValidRomanianPhone } from '../lib/constants'
import type { Product } from '../types'

interface Props {
  product: Product
  onClose: () => void
}

export default function RequestModal({ product, onClose }: Props) {
  const { addOrder } = useOrdersStore()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Sunt interesat(ă) de lucrarea "${product.name}".`,
  })
  const [phoneError, setPhoneError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.phone && !isValidRomanianPhone(form.phone)) {
      setPhoneError('Număr invalid (ex: 0755 184 334)')
      return
    }
    setPhoneError('')
    setLoading(true)

    const id = `CER-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    await addOrder({
      id,
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      shipping_address: { name: form.name, street: '', city: '', county: '', postal_code: '', country: 'România' },
      items: [{ product_id: product.id, product_name: product.name, quantity: 1, price: product.price }],
      total: product.price,
      shipping_cost: 0,
      payment_status: 'pending',
      order_status: 'Nouă',
      payment_method: 'la_comanda' as 'ramburs',
      created_at: new Date().toISOString(),
    })

    setLoading(false)
    setSent(true)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-cream w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-darker">
          <div>
            <p className="font-serif text-xl font-light text-charcoal">Solicită lucrarea</p>
            <p className="text-xs text-brand-muted mt-0.5">{product.name}</p>
          </div>
          <button onClick={onClose} className="text-brand-muted hover:text-charcoal transition-colors">
            <X size={20} />
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-12 text-center">
            <CheckCircle size={48} className="text-gold mx-auto mb-4" strokeWidth={1.5} />
            <p className="font-serif text-2xl font-light text-charcoal mb-3">Cererea a fost trimisă!</p>
            <p className="text-brand-muted text-sm leading-relaxed max-w-xs mx-auto">
              Îți mulțumesc pentru interes. Te voi contacta în cel mai scurt timp pentru a discuta detaliile.
            </p>
            <button onClick={onClose} className="btn-outline mt-8">
              Închide
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            <p className="text-sm text-brand-muted leading-relaxed">
              Completează formularul și te voi contacta pentru a discuta disponibilitatea și detaliile livrării.
            </p>

            <div className="bg-white border border-cream-darker p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal">{product.name}</p>
                {product.dimensions && (
                  <p className="text-xs text-brand-muted">{product.dimensions} · {product.technique}</p>
                )}
              </div>
              <p className="font-serif text-lg text-charcoal">{product.price.toLocaleString('ro-RO')} RON</p>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Nume *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Prenume Nume"
                className="w-full px-4 py-3 border border-cream-darker bg-white text-sm outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs tracking-widests uppercase text-charcoal mb-2 font-sans">Email *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="email@exemplu.ro"
                className="w-full px-4 py-3 border border-cream-darker bg-white text-sm outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs tracking-widests uppercase text-charcoal mb-2 font-sans">Telefon</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => { setPhoneError(''); setForm((f) => ({ ...f, phone: e.target.value })) }}
                placeholder="0755 184 334"
                className={`w-full px-4 py-3 border bg-white text-sm outline-none focus:border-gold transition-colors ${phoneError ? 'border-red-400' : 'border-cream-darker'}`}
              />
              {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-widests uppercase text-charcoal mb-2 font-sans">Mesaj</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-cream-darker bg-white text-sm outline-none focus:border-gold transition-colors resize-none"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center gap-2">
              {loading ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : null}
              {loading ? 'Se trimite...' : 'Trimite cererea'}
            </button>
            <p className="text-xs text-brand-muted text-center">
              Nu se percepe nicio plată acum. Te voi contacta eu pentru detalii.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
