import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useProductsStore } from '../store/productsStore'
import ProductCard from '../components/ProductCard'
import type { ProductCategory } from '../types'

const CATEGORIES: ProductCategory[] = ['Abstract Gold', 'Neutral Collection', 'Textured Art', 'Custom Works']

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recomandate' },
  { value: 'price_asc', label: 'Preț crescător' },
  { value: 'price_desc', label: 'Preț descrescător' },
  { value: 'newest', label: 'Cele mai noi' },
]

export default function GaleriePage() {
  const { products, fetchProducts, isLoading } = useProductsStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('recommended')
  const [filterCat, setFilterCat] = useState<ProductCategory | ''>((searchParams.get('categoria') as ProductCategory) ?? '')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [maxPrice, setMaxPrice] = useState(10000)

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.status !== 'draft')
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    }
    if (filterCat) list = list.filter((p) => p.category === filterCat)
    list = list.filter((p) => p.price <= maxPrice)
    if (sort === 'price_asc') list = [...list].sort((a, b) => a.price - b.price)
    else if (sort === 'price_desc') list = [...list].sort((a, b) => b.price - a.price)
    else if (sort === 'newest') list = [...list].sort((a, b) => b.created_at.localeCompare(a.created_at))
    return list
  }, [products, search, filterCat, sort, maxPrice])

  const clearFilters = () => {
    setSearch('')
    setFilterCat('')
    setSort('recommended')
    setMaxPrice(10000)
    setSearchParams({})
  }

  const hasFilters = search || filterCat || sort !== 'recommended' || maxPrice < 10000

  return (
    <div className="min-h-screen bg-cream pt-16">
      {/* Page Header */}
      <div className="bg-white border-b border-cream-darker">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 text-center">
          <p className="font-serif text-5xl font-light text-charcoal tracking-wider">GALERIE</p>
          <div className="gold-divider" />
          <p className="text-brand-muted text-sm mt-2">Lucrări originale, realizate manual</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Caută lucrări..."
              className="w-full pl-9 pr-9 py-2.5 border border-cream-darker bg-white text-sm outline-none focus:border-gold transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-charcoal">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 border text-sm transition-colors ${filtersOpen ? 'border-gold bg-gold text-white' : 'border-cream-darker bg-white text-charcoal hover:border-gold'}`}
          >
            <SlidersHorizontal size={15} />
            Filtre
            {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
          </button>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 border border-cream-darker bg-white text-sm outline-none focus:border-gold transition-colors"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Filters Panel */}
        {filtersOpen && (
          <div className="bg-white border border-cream-darker p-6 mb-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-xs tracking-widest uppercase text-charcoal mb-3 font-sans">Categorie</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterCat('')}
                  className={`text-xs px-3 py-1.5 border transition-colors ${!filterCat ? 'border-gold bg-gold text-white' : 'border-cream-darker text-brand-muted hover:border-gold'}`}
                >
                  Toate
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilterCat(filterCat === c ? '' : c)}
                    className={`text-xs px-3 py-1.5 border transition-colors ${filterCat === c ? 'border-gold bg-gold text-white' : 'border-cream-darker text-brand-muted hover:border-gold'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-charcoal mb-3 font-sans">
                Preț maxim: {maxPrice.toLocaleString('ro-RO')} RON
              </p>
              <input
                type="range"
                min={100}
                max={10000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold"
              />
              <div className="flex justify-between text-xs text-brand-muted mt-1">
                <span>100 RON</span>
                <span>10.000 RON</span>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {filterCat && (
              <span className="flex items-center gap-1 text-xs bg-gold-100 text-gold-dark px-3 py-1">
                {filterCat}
                <button onClick={() => setFilterCat('')}><X size={12} /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-brand-muted hover:text-gold underline transition-colors">
              Șterge filtrele
            </button>
          </div>
        )}

        {/* Results count */}
        <p className="text-xs text-brand-muted tracking-wider mb-6">
          {filtered.length} {filtered.length === 1 ? 'lucrare' : 'lucrări'}
        </p>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-cream-darker" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-cream-darker w-16" />
                  <div className="h-5 bg-cream-darker w-3/4" />
                  <div className="h-4 bg-cream-darker w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-3xl font-light text-charcoal mb-4">Nicio lucrare găsită</p>
            <p className="text-brand-muted text-sm mb-8">Încearcă să modifici criteriile de filtrare</p>
            <button onClick={clearFilters} className="btn-outline">
              Resetează filtrele
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
