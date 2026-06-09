import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Product } from '../types'
import { CATEGORY_COLORS } from '../lib/constants'
import RequestModal from './RequestModal'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const [showRequest, setShowRequest] = useState(false)
  const isOOS = product.status === 'out_of_stock' || product.stock_qty === 0
  const discountPct =
    product.show_compare_price && product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : null

  return (
    <>
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
        <div className="p-3 sm:p-4">
          <div className="flex items-start justify-between gap-1 mb-2">
            <span className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-1.5 py-0.5 leading-tight shrink-0 ${CATEGORY_COLORS[product.category] ?? 'bg-gold-50 text-gold-dark'}`}>
              {product.category}
            </span>
            {product.dimensions && (
              <span className="text-[9px] sm:text-[10px] text-brand-muted tracking-wide text-right leading-tight">{product.dimensions}</span>
            )}
          </div>

          <Link to={`/tablou/${product.id}`} className="block mb-2 sm:mb-3">
            <h3 className="font-serif text-base sm:text-lg font-light text-charcoal hover:text-gold transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between gap-1">
            <div className="min-w-0">
              <span className="font-serif text-base sm:text-xl text-charcoal">
                {product.price.toLocaleString('ro-RO')} <span className="text-sm">RON</span>
              </span>
              {product.show_compare_price && product.compare_price && product.compare_price > product.price && (
                <span className="text-xs text-brand-muted line-through block sm:inline sm:ml-2">
                  {product.compare_price.toLocaleString('ro-RO')} RON
                </span>
              )}
            </div>
            <button
              onClick={() => !isOOS && setShowRequest(true)}
              disabled={isOOS}
              className={`text-[10px] sm:text-xs tracking-widest uppercase px-2 sm:px-3 py-1.5 sm:py-2 border transition-colors shrink-0 ${
                isOOS
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gold text-gold hover:bg-gold hover:text-white'
              }`}
            >
              {isOOS ? 'Indisponibil' : 'Solicită'}
            </button>
          </div>
        </div>
      </div>

      {showRequest && (
        <RequestModal product={product} onClose={() => setShowRequest(false)} />
      )}
    </>
  )
}
