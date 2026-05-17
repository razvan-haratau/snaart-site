import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useSettingsStore } from '../store/settingsStore'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()
  const { settings } = useSettingsStore()
  const subtotal = total()
  const shipping = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingCost
  const orderTotal = subtotal + shipping

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={closeCart} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-cream z-50 flex flex-col shadow-hover">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-darker">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-gold" />
            <span className="font-serif text-xl font-light text-charcoal tracking-wide">
              Coș ({items.length})
            </span>
          </div>
          <button onClick={closeCart} className="text-charcoal/50 hover:text-charcoal transition-colors" aria-label="Închide coș">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
            <ShoppingBag size={48} className="text-gold/30" />
            <p className="font-serif text-2xl font-light text-charcoal">Coșul este gol</p>
            <p className="text-brand-muted text-sm">Descoperă lucrările din galerie</p>
            <button onClick={closeCart}>
              <Link to="/galerie" className="btn-outline mt-2">
                Explorează galeria
              </Link>
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 pb-4 border-b border-cream-darker last:border-0">
                  <div className="w-20 h-24 shrink-0 overflow-hidden bg-cream-dark">
                    {product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif text-2xl text-gold/30">S</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-base font-light text-charcoal line-clamp-2 leading-snug mb-1">
                      {product.name}
                    </p>
                    {product.dimensions && (
                      <p className="text-xs text-brand-muted mb-2">{product.dimensions}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-cream-darker">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-cream-dark transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 h-7 flex items-center justify-center text-sm font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock_qty}
                          className="w-7 h-7 flex items-center justify-center hover:bg-cream-dark transition-colors disabled:opacity-40"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-brand-muted hover:text-red-500 transition-colors"
                        aria-label="Șterge"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p className="font-serif text-base text-charcoal mt-2">
                      {(product.price * quantity).toLocaleString('ro-RO')} RON
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-cream-darker px-6 py-5">
              {subtotal < settings.freeShippingThreshold && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-brand-muted mb-2">
                    <span>Livrare gratuită de la {settings.freeShippingThreshold} RON</span>
                    <span>{(settings.freeShippingThreshold - subtotal).toLocaleString('ro-RO')} RON rămași</span>
                  </div>
                  <div className="h-1 bg-cream-darker">
                    <div
                      className="h-full bg-gold transition-all"
                      style={{ width: `${Math.min((subtotal / settings.freeShippingThreshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-brand-muted">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString('ro-RO')} RON</span>
                </div>
                <div className="flex justify-between text-brand-muted">
                  <span>Livrare</span>
                  <span>{shipping === 0 ? 'Gratuită' : `${shipping} RON`}</span>
                </div>
                <div className="flex justify-between font-serif text-lg text-charcoal border-t border-cream-darker pt-2">
                  <span>Total</span>
                  <span>{orderTotal.toLocaleString('ro-RO')} RON</span>
                </div>
              </div>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="btn-primary w-full justify-center"
              >
                Finalizează comanda
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
