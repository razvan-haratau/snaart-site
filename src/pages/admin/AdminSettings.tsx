import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { useSettingsStore } from '../../store/settingsStore'

export default function AdminSettings() {
  const { settings, fetchSettings, updateSettings, isLoading } = useSettingsStore()
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchSettings() }, [fetchSettings])
  useEffect(() => { setForm(settings) }, [settings])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await updateSettings(form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (isLoading) return <p className="text-brand-muted text-sm">Se încarcă...</p>

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="font-serif text-2xl font-light text-charcoal">Setări</p>
        <p className="text-brand-muted text-sm mt-1">Configurare generală a site-ului</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact */}
        <div className="bg-white border border-cream-darker p-6">
          <p className="font-sans font-medium text-charcoal text-sm mb-4">Informații contact</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: 'storeName', label: 'Nume magazin' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Telefon' },
              { key: 'whatsapp', label: 'WhatsApp' },
              { key: 'address', label: 'Adresă / Locație' },
            ].map(({ key, label }) => (
              <div key={key} className={key === 'address' ? 'sm:col-span-2' : ''}>
                <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">{label}</label>
                <input
                  value={(form as unknown as Record<string, string>)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-cream-darker text-sm outline-none focus:border-gold transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Social */}
        <div className="bg-white border border-cream-darker p-6">
          <p className="font-sans font-medium text-charcoal text-sm mb-4">Rețele sociale</p>
          <div className="space-y-3">
            {[
              { key: 'instagramUrl', label: 'Instagram URL' },
              { key: 'facebookUrl', label: 'Facebook URL' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">{label}</label>
                <input
                  value={(form as unknown as Record<string, string>)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-cream-darker text-sm outline-none focus:border-gold transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white border border-cream-darker p-6">
          <p className="font-sans font-medium text-charcoal text-sm mb-4">Livrare</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">
                Prag livrare gratuită (RON)
              </label>
              <input
                type="number"
                min={0}
                value={form.freeShippingThreshold}
                onChange={(e) => setForm((f) => ({ ...f, freeShippingThreshold: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 border border-cream-darker text-sm outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">
                Cost livrare standard (RON)
              </label>
              <input
                type="number"
                min={0}
                value={form.shippingCost}
                onChange={(e) => setForm((f) => ({ ...f, shippingCost: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 border border-cream-darker text-sm outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="btn-primary gap-2">
            {saved ? <Check size={14} /> : null}
            {saving ? 'Se salvează...' : saved ? 'Salvat!' : 'Salvează setările'}
          </button>
          {saved && <p className="text-emerald-600 text-xs tracking-wider">Setările au fost actualizate.</p>}
        </div>
      </form>
    </div>
  )
}
