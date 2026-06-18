import { useEffect, useState, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Check, Upload, Loader2 } from 'lucide-react'
import { useProductsStore } from '../../store/productsStore'
import { uploadImage, deleteImage } from '../../lib/imageUpload'
import type { Product, ProductCategory } from '../../types'

const CATEGORIES: ProductCategory[] = ['Abstract Gold', 'Neutral Collection', 'Textured Art', 'Custom Works']
const TECHNIQUES = ['Acrilic + Foiță de Aur', 'Mixed Media', 'Ulei + Textură', 'Alcohol Ink', 'Pastă de Textură', 'Altele']
const SURFACES = ['Pânză pe șasiu', 'Pânză înrămată', 'MDF', 'Altele']
const DIMENSIONS = ['30x40 cm', '40x40 cm', '40x50 cm', '50x60 cm', '50x70 cm', '60x80 cm', '70x100 cm', '80x100 cm', '100x120 cm', '100x150 cm', 'Personalizat']

type FormState = Omit<Product, 'id' | 'created_at' | 'updated_at'>

const emptyForm = (): FormState => ({
  name: '', description: '', price: 0, compare_price: 0, show_compare_price: false,
  sku: '', stock_qty: 1, category: 'Abstract Gold', dimensions: '', technique: '', surface: '',
  images: [''], status: 'active',
})

export default function AdminProducts() {
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct, isLoading } = useProductsStore()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const openAdd = () => {
    setForm(emptyForm())
    setEditId(null)
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    setForm({
      name: p.name, description: p.description, price: p.price,
      compare_price: p.compare_price ?? 0, show_compare_price: p.show_compare_price ?? false,
      sku: p.sku, stock_qty: p.stock_qty, category: p.category as ProductCategory,
      dimensions: p.dimensions ?? '', technique: p.technique ?? '', surface: p.surface ?? '',
      images: p.images.length ? p.images : [''], status: p.status,
    })
    setEditId(p.id)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const data = { ...form, images: form.images.filter(Boolean) }
    if (editId) {
      await updateProduct(editId, data)
    } else {
      await addProduct(data)
    }
    setSaving(false)
    setShowForm(false)
    setEditId(null)
  }

  const handleDelete = async (id: string) => {
    await deleteProduct(id)
    setDeleteConfirm(null)
  }

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-serif text-2xl font-light text-charcoal">Lucrări</p>
          <p className="text-brand-muted text-sm mt-1">{products.length} lucrări în total</p>
        </div>
        <button onClick={openAdd} className="btn-primary gap-2">
          <Plus size={14} />
          Adaugă lucrare
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-cream-darker overflow-x-auto">
        {isLoading ? (
          <p className="text-center text-brand-muted py-10 text-sm">Se încarcă...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-brand-muted py-10 text-sm">Nicio lucrare adăugată încă.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-cream-darker">
              <tr className="text-xs tracking-widest uppercase text-brand-muted">
                <th className="text-left px-4 py-3">Lucrare</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Categorie</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Dimensiuni</th>
                <th className="text-right px-4 py-3">Preț</th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">Stoc</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-darker">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-cream transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 shrink-0 bg-cream-darker overflow-hidden">
                        {p.images[0] ? (
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-serif text-lg text-gold/20">S</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-charcoal">{p.name}</p>
                        <p className="text-xs text-brand-muted">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-brand-muted">{p.category}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-brand-muted">{p.dimensions || '—'}</td>
                  <td className="px-4 py-3 text-right font-medium text-charcoal">{p.price.toLocaleString('ro-RO')} RON</td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell text-brand-muted">{p.stock_qty}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 ${
                      p.status === 'active' ? 'bg-emerald-50 text-emerald-600' :
                      p.status === 'out_of_stock' ? 'bg-red-50 text-red-500' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {p.status === 'active' ? 'Activ' : p.status === 'out_of_stock' ? 'Indisponibil' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-brand-muted hover:text-gold transition-colors">
                        <Pencil size={14} />
                      </button>
                      {deleteConfirm === p.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-500 hover:text-red-700">
                            <Check size={14} />
                          </button>
                          <button onClick={() => setDeleteConfirm(null)} className="p-1.5 text-brand-muted hover:text-charcoal">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 text-brand-muted hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-end" onClick={() => setShowForm(false)}>
          <div
            className="bg-white h-full w-full max-w-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-darker sticky top-0 bg-white z-10">
              <p className="font-serif text-lg font-light text-charcoal">
                {editId ? 'Editează lucrare' : 'Adaugă lucrare nouă'}
              </p>
              <button onClick={() => setShowForm(false)} className="text-brand-muted hover:text-charcoal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Titlu *</label>
                <input value={form.name} onChange={(e) => setField('name', e.target.value)} required className="w-full px-4 py-2.5 border border-cream-darker text-sm outline-none focus:border-gold transition-colors" />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Descriere</label>
                <textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-cream-darker text-sm outline-none focus:border-gold transition-colors resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Preț (RON) *</label>
                  <input type="number" min={0} value={form.price} onChange={(e) => setField('price', Number(e.target.value))} required className="w-full px-4 py-2.5 border border-cream-darker text-sm outline-none focus:border-gold transition-colors" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Stoc *</label>
                  <input type="number" min={0} value={form.stock_qty} onChange={(e) => setField('stock_qty', Number(e.target.value))} required className="w-full px-4 py-2.5 border border-cream-darker text-sm outline-none focus:border-gold transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Preț inițial (RON)</label>
                  <input type="number" min={0} value={form.compare_price ?? 0} onChange={(e) => setField('compare_price', Number(e.target.value))} className="w-full px-4 py-2.5 border border-cream-darker text-sm outline-none focus:border-gold transition-colors" />
                </div>
                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.show_compare_price} onChange={(e) => setField('show_compare_price', e.target.checked)} className="accent-gold" />
                    <span className="text-xs text-charcoal">Afișează reducerea</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">SKU *</label>
                  <input value={form.sku} onChange={(e) => setField('sku', e.target.value)} required className="w-full px-4 py-2.5 border border-cream-darker text-sm outline-none focus:border-gold transition-colors" placeholder="SNA-001" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Categorie</label>
                  <select value={form.category} onChange={(e) => setField('category', e.target.value as ProductCategory)} className="w-full px-4 py-2.5 border border-cream-darker text-sm outline-none focus:border-gold transition-colors">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Dimensiuni</label>
                  <select value={form.dimensions} onChange={(e) => setField('dimensions', e.target.value)} className="w-full px-4 py-2.5 border border-cream-darker text-sm outline-none focus:border-gold transition-colors">
                    <option value="">—</option>
                    {DIMENSIONS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Tehnică</label>
                  <select value={form.technique} onChange={(e) => setField('technique', e.target.value)} className="w-full px-4 py-2.5 border border-cream-darker text-sm outline-none focus:border-gold transition-colors">
                    <option value="">—</option>
                    {TECHNIQUES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Suport</label>
                <select value={form.surface} onChange={(e) => setField('surface', e.target.value)} className="w-full px-4 py-2.5 border border-cream-darker text-sm outline-none focus:border-gold transition-colors">
                  <option value="">—</option>
                  {SURFACES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Status</label>
                <select value={form.status} onChange={(e) => setField('status', e.target.value as Product['status'])} className="w-full px-4 py-2.5 border border-cream-darker text-sm outline-none focus:border-gold transition-colors">
                  <option value="active">Activ</option>
                  <option value="draft">Draft</option>
                  <option value="out_of_stock">Indisponibil</option>
                </select>
              </div>

              <div>
                <label className="block text-xs tracking-widests uppercase text-charcoal mb-2 font-sans">Imagini</label>
                {uploadError && (
                  <p className="text-red-500 text-xs mb-2">{uploadError}</p>
                )}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {form.images.filter(Boolean).map((url, i) => (
                    <div key={i} className="relative group aspect-square bg-cream-darker overflow-hidden">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={async () => {
                          await deleteImage(url)
                          setField('images', form.images.filter((_, j) => j !== i))
                        }}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {/* Upload button */}
                  <button
                    type="button"
                    onClick={() => {
                      const idx = form.images.filter(Boolean).length
                      fileInputRefs.current[idx]?.click()
                    }}
                    className="aspect-square border-2 border-dashed border-cream-darker hover:border-gold flex flex-col items-center justify-center gap-1 transition-colors"
                  >
                    {uploadingIdx !== null ? (
                      <Loader2 size={20} className="text-gold animate-spin" />
                    ) : (
                      <>
                        <Upload size={20} className="text-brand-muted" />
                        <span className="text-xs text-brand-muted">Adaugă</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Hidden file inputs */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <input
                    key={i}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => { fileInputRefs.current[i] = el }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setUploadError(null)
                      setUploadingIdx(i)
                      try {
                        const url = await uploadImage(file)
                        const imgs = [...form.images.filter(Boolean), url]
                        setField('images', imgs)
                      } catch (err) {
                        setUploadError('Eroare la upload. Încearcă din nou.')
                      } finally {
                        setUploadingIdx(null)
                        e.target.value = ''
                      }
                    }}
                  />
                ))}
                <p className="text-xs text-brand-muted">Imaginile sunt comprimate automat. Max 5 poze per lucrare.</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-cream-darker">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1 justify-center">
                  Anulează
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? 'Se salvează...' : editId ? 'Salvează' : 'Adaugă'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
