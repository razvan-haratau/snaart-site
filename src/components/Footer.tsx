import { Link } from 'react-router-dom'
import { Instagram, MessageCircle } from 'lucide-react'
import { useSettingsStore } from '../store/settingsStore'

function TikTokIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/>
    </svg>
  )
}

export default function Footer() {
  const { settings } = useSettingsStore()
  const year = new Date().getFullYear()
  const tiktokUrl = 'https://www.tiktok.com/@alexandraharataustoe'

  return (
    <footer className="bg-charcoal text-cream">
      {/* CTA Strip */}
      <div className="border-b border-charcoal-lighter">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="font-serif text-4xl font-light tracking-wider text-cream mb-2">
              Hai să creăm
            </p>
            <p className="font-serif text-4xl font-light tracking-wider text-gold">
              ceva special împreună
            </p>
            <p className="text-cream/60 mt-4 text-sm tracking-wide">
              Pentru mai multe informații sau colaborări, mă poți contacta pe una dintre platformele de mai jos.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-px bg-charcoal-lighter">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-charcoal flex flex-col items-center gap-2 sm:gap-3 py-6 sm:py-8 px-2 hover:bg-charcoal-lighter transition-colors group overflow-hidden"
            >
              <Instagram size={20} className="text-gold group-hover:scale-110 transition-transform shrink-0" />
              <div className="text-center w-full overflow-hidden">
                <p className="text-[9px] sm:text-xs tracking-widest uppercase text-cream/60">Instagram</p>
                <p className="text-[10px] sm:text-sm text-cream mt-0.5 truncate">@snaart2026</p>
              </div>
            </a>
            <a
              href={`https://wa.me/40${settings.whatsapp.replace(/[^0-9]/g, '').slice(1)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-charcoal flex flex-col items-center gap-2 sm:gap-3 py-6 sm:py-8 px-2 hover:bg-charcoal-lighter transition-colors group overflow-hidden"
            >
              <MessageCircle size={20} className="text-gold group-hover:scale-110 transition-transform shrink-0" />
              <div className="text-center w-full overflow-hidden">
                <p className="text-[9px] sm:text-xs tracking-widest uppercase text-cream/60">WhatsApp</p>
                <p className="text-[10px] sm:text-sm text-cream mt-0.5 truncate">{settings.whatsapp}</p>
              </div>
            </a>
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-charcoal flex flex-col items-center gap-2 sm:gap-3 py-6 sm:py-8 px-2 hover:bg-charcoal-lighter transition-colors group overflow-hidden"
            >
              <span className="text-gold group-hover:scale-110 transition-transform block shrink-0">
                <TikTokIcon size={20} />
              </span>
              <div className="text-center w-full overflow-hidden">
                <p className="text-[9px] sm:text-xs tracking-widest uppercase text-cream/60">TikTok</p>
                <p className="text-[10px] sm:text-sm text-cream mt-0.5 truncate">@alexandraharataustoe</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-serif text-xl tracking-[0.3em] text-cream">SNAART</span>
          <span className="text-[9px] tracking-[0.4em] text-gold uppercase">Art with Soul</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-4 text-xs tracking-wider uppercase text-cream/50">
          <Link to="/galerie" className="hover:text-gold transition-colors">Galerie</Link>
          <Link to="/despre" className="hover:text-gold transition-colors">Despre</Link>
          <Link to="/contact" className="hover:text-gold transition-colors">Contact</Link>
          <Link to="/termeni" className="hover:text-gold transition-colors">Termeni</Link>
          <Link to="/confidentialitate" className="hover:text-gold transition-colors">Confidențialitate</Link>
          <Link to="/retur" className="hover:text-gold transition-colors">Retur</Link>
        </nav>
        <div className="flex items-center gap-4">
          <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-gold transition-colors" aria-label="Instagram">
            <Instagram size={16} />
          </a>
          <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-gold transition-colors" aria-label="TikTok">
            <TikTokIcon size={16} />
          </a>
        </div>
      </div>
      <div className="border-t border-charcoal-lighter">
        <p className="text-center text-xs text-cream/30 tracking-wider py-4">
          © {year} SNAART. Toate drepturile rezervate.
        </p>
      </div>
    </footer>
  )
}
