import { useState } from 'react'
import { Instagram, MessageCircle, MapPin, CheckCircle, Mail } from 'lucide-react'
import { useSettingsStore } from '../store/settingsStore'

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/>
    </svg>
  )
}

export default function ContactPage() {
  const { settings } = useSettingsStore()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', hp: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const tiktokUrl = 'https://www.tiktok.com/@alexandraharataustoe'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.hp) return
    setLoading(true)
    await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'contact',
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      }),
    })
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-cream pt-16">
      {/* Header */}
      <div className="bg-charcoal">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="font-serif text-5xl font-light text-cream tracking-wider">CONTACT</p>
          <div className="gold-divider" />
          <p className="text-cream/60 text-sm mt-2">Hai să vorbim despre arta care te-a captivat</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 grid lg:grid-cols-3 gap-12">
        {/* Sidebar */}
        <div className="space-y-6">
          <a
            href={`https://wa.me/40${settings.whatsapp.replace(/[^0-9]/g, '').slice(1)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white p-6 border border-cream-darker hover:border-gold transition-colors group"
          >
            <div className="flex items-start gap-4">
              <MessageCircle size={20} className="text-gold mt-0.5 shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <div>
                <p className="text-xs tracking-widest uppercase text-brand-muted mb-1 font-sans">WhatsApp</p>
                <p className="text-charcoal font-medium">{settings.whatsapp}</p>
                <p className="text-brand-muted text-xs mt-1">Răspund în câteva ore</p>
              </div>
            </div>
          </a>

          <a
            href="mailto:harataualexandra@gmail.com"
            className="block bg-white p-6 border border-cream-darker hover:border-gold transition-colors group"
          >
            <div className="flex items-start gap-4">
              <Mail size={20} className="text-gold mt-0.5 shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <div>
                <p className="text-xs tracking-widest uppercase text-brand-muted mb-1 font-sans">Email</p>
                <p className="text-charcoal font-medium">harataualexandra@gmail.com</p>
                <p className="text-brand-muted text-xs mt-1">Răspund în 24-48h</p>
              </div>
            </div>
          </a>

          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white p-6 border border-cream-darker hover:border-gold transition-colors group"
          >
            <div className="flex items-start gap-4">
              <Instagram size={20} className="text-gold mt-0.5 shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <div>
                <p className="text-xs tracking-widest uppercase text-brand-muted mb-1 font-sans">Instagram</p>
                <p className="text-charcoal font-medium">@snaart2026</p>
                <p className="text-brand-muted text-xs mt-1">Urmărește procesul creativ</p>
              </div>
            </div>
          </a>

          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white p-6 border border-cream-darker hover:border-gold transition-colors group"
          >
            <div className="flex items-start gap-4">
              <span className="text-gold mt-0.5 shrink-0 group-hover:scale-110 transition-transform block">
                <TikTokIcon size={20} />
              </span>
              <div>
                <p className="text-xs tracking-widest uppercase text-brand-muted mb-1 font-sans">TikTok</p>
                <p className="text-charcoal font-medium">@alexandraharataustoe</p>
                <p className="text-brand-muted text-xs mt-1">Video din atelier</p>
              </div>
            </div>
          </a>

          <div className="bg-white p-6 border border-cream-darker">
            <div className="flex items-start gap-4">
              <MapPin size={20} className="text-gold mt-0.5 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-xs tracking-widest uppercase text-brand-muted mb-1 font-sans">Locație</p>
                <p className="text-charcoal">{settings.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          {sent ? (
            <div className="bg-white p-10 text-center border border-cream-darker">
              <CheckCircle size={48} className="text-gold mx-auto mb-4" strokeWidth={1.5} />
              <p className="font-serif text-3xl font-light text-charcoal mb-3">Mesaj trimis!</p>
              <p className="text-brand-muted text-sm mb-6">
                Mulțumesc pentru mesaj! Te voi contacta în cel mai scurt timp posibil.
              </p>
              <button onClick={() => setSent(false)} className="btn-outline">
                Trimite alt mesaj
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 border border-cream-darker">
              <p className="font-serif text-2xl font-light text-charcoal mb-2">Trimite un mesaj</p>
              <div className="w-8 h-px bg-gold mb-6" />
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="hp" value={form.hp} onChange={handleChange} className="hidden" tabIndex={-1} autoComplete="off" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Nume *</label>
                    <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 border border-cream-darker bg-cream text-sm outline-none focus:border-gold transition-colors" placeholder="Numele tău" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 border border-cream-darker bg-cream text-sm outline-none focus:border-gold transition-colors" placeholder="email@exemplu.ro" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Telefon</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 border border-cream-darker bg-cream text-sm outline-none focus:border-gold transition-colors" placeholder="07XX XXX XXX" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Subiect</label>
                    <select name="subject" value={form.subject} onChange={handleChange} className="w-full px-4 py-3 border border-cream-darker bg-cream text-sm outline-none focus:border-gold transition-colors">
                      <option value="">Selectează...</option>
                      <option>Întrebare despre o lucrare</option>
                      <option>Comandă personalizată</option>
                      <option>Colaborare</option>
                      <option>Altele</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-charcoal mb-2 font-sans">Mesaj *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="w-full px-4 py-3 border border-cream-darker bg-cream text-sm outline-none focus:border-gold transition-colors resize-none" placeholder="Spune-mi cum te pot ajuta..." />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : null}
                  {loading ? 'Se trimite...' : 'Trimite mesajul'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
