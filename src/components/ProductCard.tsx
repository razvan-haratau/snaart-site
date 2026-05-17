import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import type { Product } from '../types'
import { CATEGORY_COLORS } from '../lib/constants'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addItem, openCart } = useCartStore()
  const isOOS = product.status === 'out_of_stock' || product.stock_qty === 0
  const discountPct =
    product.show_compare_price && product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : null

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isOOS) return
    addItem(product)
    openCart()
  }

  return (
    <div className="group bg-white overflow-hidden shadow-card hover:shadow-hover transition-all duration-300">
      {/* Image */}
      <Link to={`/tablou/${product.id}`} className="block relative overflow-hidden aspect-[4/5]">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-cream-darker flex items-center justify-center">
            <span className="font-serif text-4xl text-gold/30">S</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isOOS && (
            <span className="bg-charcoal text-cream text-[10px] px-2.5 py-1 tracking-widest uppercase">
              Indisponibil
            </span>
          )}
          {discountPct && !isOOS && (
            <span className="bg-gold text-white text-[10px] px-2.5 py-1 tracking-wider">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-300 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
          <Link
            to={`/tablou/${product.id}`}
            className="flex items-center gap-2 bg-white text-charcoal text-xs tracking-widest uppercase px-4 py-2.5 hover:bg-gold hover:text-white transition-colors"
          >
            <ArrowRight size={14} />
            Vezi detalii
          </Link>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 ${CATEGORY_COLORS[product.category] ?? 'bg-gold-50 text-gold-dark'}`}>
            {product.category}
          </span>
          {product.dimensions && (
            <span className="text-[10px] text-brand-muted tracking-wide">{product.dimensions}</span>
          )}
        </div>

        <Link to={`/tablou/${product.id}`} className="block mb-3">
          <h3 className="font-serif text-lg font-light text-charcoal hover:text-gold transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-serif text-xl text-charcoal">
              {product.price.toLocaleString('ro-RO')} RON
            </span>
            {product.show_compare_price && product.compare_price && product.compare_price > product.price && (
              <span className="text-sm text-brand-muted line-through ml-2">
                {product.compare_price.toLocaleString('ro-RO')} RON
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={isOOS}
            aria-label="Adaugă în coș"
            className={`w-9 h-9 flex items-center justify-center border transition-colors ${
              isOOS
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gold text-gold hover:bg-gold hover:text-white'
            }`}
          >
            <ShoppingBag size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
