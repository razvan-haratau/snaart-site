import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, ChevronLeft, ChevronRight, X, Minus, Plus, ArrowLeft, Truck, RotateCcw, Shield } from 'lucide-react'
import { useProductsStore } from '../store/productsStore'
import { useCartStore } from '../store/cartStore'
import ProductCard from '../components/ProductCard'
import { CATEGORY_COLORS } from '../lib/constants'

export default function TablouDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { products, fetchProducts } = useProductsStore()
  const { addItem, openCart } = useCartStore()
  const [imgIdx, setImgIdx] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [qty, setQty] = useState(1)

  useEffect(() => { if (products.length === 0) fetchProducts() }, [products.length, fetchProducts])

  const product = products.find((p) => p.id === id)

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!lightbox || !product) return
    if (e.key === 'Escape') setLightbox(false)
    if (e.key === 'ArrowRight') setImgIdx((i) => (i + 1) % product.images.length)
    if (e.key === 'ArrowLeft') setImgIdx((i) => (i - 1 + product.images.length) % product.images.length)
  }, [lightbox, product])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  if (!product && products.length > 0) {
    return (
      <div className="min-h-screen bg-cream pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-3xl font-light text-charcoal mb-4">Lucrarea nu a fost găsită</p>
          <Link to="/galerie" className="btn-outline">Înapoi la galerie</Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream pt-16 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="h-8 w-64 bg-cream-darker mx-auto mb-4" />
          <div className="h-4 w-48 bg-cream-darker mx-auto" />
        </div>
      </div>
    )
  }

  const isOOS = product.status === 'out_of_stock' || product.stock_qty === 0
  const discountPct =
    product.show_compare_price && product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : null

  const related = products
    .filter((p) => p.id !== product.id && p.status === 'active')
    .sort((a, b) => (a.category === product.category ? -1 : 1) - (b.category === product.category ? -1 : 1))
    .slice(0, 4)

  const handleAdd = () => {
    addItem(product, qty)
    openCart()
  }

  return (
    <div className="min-h-screen bg-cream pt-16">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-brand-muted tracking-wider">
          <Link to="/" className="hover:text-gold transition-colors">Acasă</Link>
          <span>/</span>
          <Link to="/galerie" className="hover:text-gold transition-colors">Galerie</Link>
          <span>/</span>
          <span className="text-charcoal">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20 grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          {/* Main Image */}
          <div
            className="relative aspect-[4/5] bg-cream-darker overflow-hidden cursor-zoom-in mb-3"
            onClick={() => product.images.length > 0 && setLightbox(true)}
          >
            {product.images[imgIdx] ? (
              <img
                src={product.images[imgIdx]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-serif text-8xl text-gold/20">S</span>
              </div>
            )}
            {discountPct && (
              <span className="absolute top-4 left-4 bg-gold text-white text-xs px-3 py-1 tracking-wider">
                -{discountPct}%
              </span>
            )}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + product.images.length) % product.images.length) }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center hover:bg-white"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % product.images.length) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center hover:bg-white"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`w-16 h-20 overflow-hidden flex-shrink-0 border-2 transition-colors ${i === imgIdx ? 'border-gold' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="py-4">
          <span className={`inline-block text-xs tracking-wider uppercase px-3 py-1 mb-4 ${CATEGORY_COLORS[product.category] ?? 'bg-gold-50 text-gold-dark'}`}>
            {product.category}
          </span>

          <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal tracking-wide leading-tight mb-4">
            {product.name}
          </h1>
          <div className="w-10 h-px bg-gold mb-6" />

          <p className="text-brand-muted text-sm leading-relaxed mb-8">{product.description}</p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            {product.dimensions && (
              <div className="border-b border-cream-darker pb-3">
                <p className="text-xs tracking-widest uppercase text-brand-muted mb-1">Dimensiuni</p>
                <p className="text-charcoal">{product.dimensions}</p>
              </div>
            )}
            {product.technique && (
              <div className="border-b border-cream-darker pb-3">
                <p className="text-xs tracking-widest uppercase text-brand-muted mb-1">Tehnică</p>
                <p className="text-charcoal">{product.technique}</p>
              </div>
            )}
            {product.surface && (
              <div className="border-b border-cream-darker pb-3">
                <p className="text-xs tracking-widest uppercase text-brand-muted mb-1">Suport</p>
                <p className="text-charcoal">{product.surface}</p>
              </div>
            )}
            <div className="border-b border-cream-darker pb-3">
              <p className="text-xs tracking-widest uppercase text-brand-muted mb-1">Disponibilitate</p>
              <p className={isOOS ? 'text-red-500' : product.stock_qty <= 2 ? 'text-amber-600' : 'text-emerald-600'}>
                {isOOS ? 'Indisponibil' : product.stock_qty <= 2 ? `Ultimul exemplar` : 'Disponibil'}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-8">
            <span className="font-serif text-3xl text-charcoal">
              {product.price.toLocaleString('ro-RO')} RON
            </span>
            {product.show_compare_price && product.compare_price && product.compare_price > product.price && (
              <span className="text-base text-brand-muted line-through mb-1">
                {product.compare_price.toLocaleString('ro-RO')} RON
              </span>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          {!isOOS && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-cream-darker">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-cream-dark transition-colors">
                  <Minus size={14} />
                </button>
                <span className="w-10 h-10 flex items-center justify-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock_qty, qty + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-cream-dark transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              <button onClick={handleAdd} className="btn-primary flex-1 justify-center gap-2">
                <ShoppingBag size={16} />
                Adaugă în coș
              </button>
            </div>
          )}

          {isOOS && (
            <p className="text-sm text-brand-muted italic mb-6">
              Această lucrare nu mai este disponibilă. Contactează-mă pentru o piesă similară.
            </p>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-cream-darker">
            {[
              { icon: Truck, label: 'Livrare\nîn România' },
              { icon: Shield, label: 'Lucrare\noriginală' },
              { icon: RotateCcw, label: 'Retur\n30 de zile' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2">
                <Icon size={18} className="text-gold" strokeWidth={1.5} />
                <p className="text-xs text-brand-muted whitespace-pre-line leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <p className="font-serif text-3xl font-light text-charcoal tracking-wider text-center mb-2">
              Lucrări similare
            </p>
            <div className="gold-divider mb-10" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Back button */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <Link to="/galerie" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-gold transition-colors tracking-wider">
          <ArrowLeft size={14} />
          Înapoi la galerie
        </Link>
      </div>

      {/* Lightbox */}
      {lightbox && product.images.length > 0 && (
        <div className="fixed inset-0 bg-charcoal/95 z-50 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 text-cream/60 hover:text-cream transition-colors" onClick={() => setLightbox(false)}>
            <X size={24} />
          </button>
          <img
            src={product.images[imgIdx]}
            alt={product.name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {product.images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + product.images.length) % product.images.length) }} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream">
                <ChevronLeft size={32} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % product.images.length) }} className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream">
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
