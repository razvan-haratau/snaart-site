import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, ChevronRight } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useSettingsStore } from '../store/settingsStore'
import { useOrdersStore } from '../store/ordersStore'
import { useProductsStore } from '../store/productsStore'
import { isValidRomanianPhone, ROMANIAN_COUNTIES } from '../lib/constants'
import type { Order, ShippingAddress } from '../types'

type Step = 'shipping' | 'payment' | 'done'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCartStore()
  const { settings } = useSettingsStore()
  const { addOrder } = useOrdersStore()
  const { decrementStock } = useProductsStore()
  const [step, setStep] = useState<Step>('shipping')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState('')

  const subtotal = total()
  const shipping = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingCost
  const orderTotal = subtotal + shipping

  const [addr, setAddr] = useState<ShippingAddress>({
    name: '', street: '', city: '', county: '', postal_code: '', country: 'România',
  })
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [payMethod, setPayMethod] = useState<'card' | 'ramburs'>('card')

  if (items.length === 0 && step !== 'done') {
    return (
      <div className="min-h-screen bg-cream pt-16 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-serif text-3xl font-light text-charcoal mb-4">Coșul tău este gol</p>
          <Link to="/galerie" className="btn-outline">Descoperă galeria</Link>
        </div>
      </div>
    )
  }

  const handleShipping = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidRomanianPhone(phone)) {
      setPhoneError('Număr de telefon invalid (ex: 0741 123 456)')
      return
    }
    setPhoneError('')
    setStep('payment')
  }

  const handleOrder = async () => {
    setLoading(true)
    const id = `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    const order: Order = {
      id,
      customer_email: email,
      customer_name: addr.name,
      customer_phone: phone,
      shipping_address: addr,
      items: items.map((i) => ({
        product_id: i.product.id,
        product_name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
      })),
      total: orderTotal,
      shipping_cost: shipping,
      payment_status: payMethod === 'ramburs' ? 'pending' : 'pending',
      order_status: 'Nouă',
      payment_method: payMethod,
      created_at: new Date().toISOString(),
    }
    await addOrder(order)
    for (const item of items) {
      await decrementStock(item.product.id, item.quantity)
    }
    clearCart()
    setOrderId(id)
    setStep('done')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream pt-16">
      {/* Steps indicator */}
      {step !== 'done' && (
        <div className="bg-white border-b border-cream-darker">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase">
              {[
                { key: 'shipping', label: 'Livrare' },
                { key: 'payment', label: 'Plată' },
              ].map((s, i, arr) => (
                <div key={s.key} className="flex items-center gap-2">
                  <span className={`font-sans ${step === s.key ? 'text-gold' : 'text-brand-muted'}`}>
                    {s.label}
                  </span>
                  {i < arr.length - 1 && <ChevronRight size={12} className="text-brand-muted" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12 grid lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 'shipping' && (
            <form onSubmit={handleShipping} className="space-y-4">
              <p className="font-serif text-2xl font-light text-charcoal mb-6">Detalii livrare</p>
              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Nume complet *</label>
                <input value={addr.name} onChange={(e) => setAddr((a) => ({ ...a, name: e.target.value }))} required className="w-full px-4 py-3 border border-cream-darker bg-white text-sm outline-none focus:border-gold transition-colors" placeholder="Prenume Nume" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Email *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-cream-darker bg-white text-sm outline-none focus:border-gold transition-colors" placeholder="email@exemplu.ro" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Telefon *</label>
                  <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setPhoneError('') }} required className={`w-full px-4 py-3 border bg-white text-sm outline-none focus:border-gold transition-colors ${phoneError ? 'border-red-400' : 'border-cream-darker'}`} placeholder="0741 123 456" />
                  {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Adresă *</label>
                <input value={addr.street} onChange={(e) => setAddr((a) => ({ ...a, street: e.target.value }))} required className="w-full px-4 py-3 border border-cream-darker bg-white text-sm outline-none focus:border-gold transition-colors" placeholder="Strada, nr., bl., sc., ap." />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Oraș *</label>
                  <input value={addr.city} onChange={(e) => setAddr((a) => ({ ...a, city: e.target.value }))} required className="w-full px-4 py-3 border border-cream-darker bg-white text-sm outline-none focus:border-gold transition-colors" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Județ *</label>
                  <select value={addr.county} onChange={(e) => setAddr((a) => ({ ...a, county: e.target.value }))} required className="w-full px-4 py-3 border border-cream-darker bg-white text-sm outline-none focus:border-gold transition-colors">
                    <option value="">Selectează</option>
                    {ROMANIAN_COUNTIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Cod poștal</label>
                  <input value={addr.postal_code} onChange={(e) => setAddr((a) => ({ ...a, postal_code: e.target.value }))} className="w-full px-4 py-3 border border-cream-darker bg-white text-sm outline-none focus:border-gold transition-colors" />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full justify-center mt-4">
                Continuă spre plată
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <p className="font-serif text-2xl font-light text-charcoal mb-6">Metodă de plată</p>
              {[
                { value: 'card', label: 'Card bancar', desc: 'Plată securizată prin Netopia Payments' },
                { value: 'ramburs', label: 'Ramburs (la livrare)', desc: 'Plătești la primirea coletului' },
              ].map((m) => (
                <label key={m.value} className={`flex items-start gap-4 p-5 border cursor-pointer transition-colors ${payMethod === m.value ? 'border-gold bg-gold-50' : 'border-cream-darker bg-white hover:border-gold/40'}`}>
                  <input type="radio" name="pay" value={m.value} checked={payMethod === m.value as 'card' | 'ramburs'} onChange={() => setPayMethod(m.value as 'card' | 'ramburs')} className="mt-0.5 accent-gold" />
                  <div>
                    <p className="font-sans font-medium text-charcoal text-sm">{m.label}</p>
                    <p className="text-brand-muted text-xs mt-1">{m.desc}</p>
                  </div>
                </label>
              ))}
              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep('shipping')} className="btn-outline flex-1 justify-center">
                  Înapoi
                </button>
                <button onClick={handleOrder} disabled={loading} className="btn-primary flex-1 justify-center gap-2">
                  {loading && (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {loading ? 'Se procesează...' : 'Plasează comanda'}
                </button>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="text-center py-8">
              <CheckCircle size={56} className="text-gold mx-auto mb-6" strokeWidth={1.5} />
              <p className="font-serif text-4xl font-light text-charcoal mb-2">Mulțumesc!</p>
              <div className="gold-divider" />
              <p className="text-brand-muted text-sm mb-2 mt-4">Comanda ta a fost înregistrată cu succes.</p>
              <p className="text-charcoal font-medium text-sm mb-8">Nr. comandă: {orderId}</p>
              <p className="text-brand-muted text-sm mb-8 max-w-md mx-auto">
                Vei primi un email de confirmare. Te voi contacta în cel mai scurt timp pentru a confirma detaliile livrării.
              </p>
              <Link to="/galerie" className="btn-outline">
                Continuă să explorezi
              </Link>
            </div>
          )}
        </div>

        {/* Order Summary */}
        {step !== 'done' && (
          <div className="bg-white p-6 border border-cream-darker self-start sticky top-20">
            <p className="font-serif text-xl font-light text-charcoal mb-4">Sumar comandă</p>
            <div className="space-y-3 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 text-sm">
                  <div className="w-14 h-16 shrink-0 bg-cream-darker overflow-hidden">
                    {product.images[0] ? (
                      <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif text-xl text-gold/20">S</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-charcoal text-xs leading-snug line-clamp-2">{product.name}</p>
                    <p className="text-brand-muted text-xs mt-1">Cant: {quantity}</p>
                    <p className="text-charcoal font-medium text-xs mt-1">{(product.price * quantity).toLocaleString('ro-RO')} RON</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-cream-darker pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-brand-muted">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString('ro-RO')} RON</span>
              </div>
              <div className="flex justify-between text-brand-muted">
                <span>Livrare</span>
                <span>{shipping === 0 ? 'Gratuită' : `${shipping} RON`}</span>
              </div>
              <div className="flex justify-between font-serif text-lg text-charcoal border-t border-cream-darker pt-2 mt-2">
                <span>Total</span>
                <span>{orderTotal.toLocaleString('ro-RO')} RON</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
