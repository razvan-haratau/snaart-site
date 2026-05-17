import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, Menu, X, Instagram } from 'lucide-react'
import { useCartStore } from '../store/cartStore'

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/>
    </svg>
  )
}

const NAV_LINKS = [
  { label: 'Acasă', href: '/' },
  { label: 'Despre', href: '/despre' },
  { label: 'Galerie', href: '/galerie' },
  { label: 'Informații', href: '/informatii' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { toggleCart, itemCount } = useCartStore()
  const count = itemCount()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-cream shadow-soft' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-serif text-2xl font-light tracking-[0.25em] text-charcoal">SNAART</span>
            <span className="text-[9px] tracking-[0.4em] text-gold uppercase font-sans">Art with Soul</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/'}
                className={({ isActive }) =>
                  `text-xs tracking-[0.2em] uppercase font-sans transition-colors border-b ${
                    isActive
                      ? 'text-gold border-gold'
                      : 'text-charcoal border-transparent hover:text-gold hover:border-gold/40'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/snaart2026/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-charcoal hover:text-gold transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.tiktok.com/@alexandraharataustoe"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-charcoal hover:text-gold transition-colors"
              aria-label="TikTok"
            >
              <TikTokIcon size={18} />
            </a>

            <button
              onClick={toggleCart}
              className="relative text-charcoal hover:text-gold transition-colors"
              aria-label="Coș de cumpărături"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden text-charcoal hover:text-gold transition-colors"
              aria-label="Meniu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-cream flex flex-col">
          <div className="flex items-center justify-between px-6 h-16 border-b border-cream-darker">
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex flex-col leading-none">
              <span className="font-serif text-2xl font-light tracking-[0.25em] text-charcoal">SNAART</span>
              <span className="text-[9px] tracking-[0.4em] text-gold uppercase">Art with Soul</span>
            </Link>
            <button onClick={() => setMenuOpen(false)} aria-label="Închide meniu">
              <X size={22} className="text-charcoal" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col items-center justify-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `font-serif text-3xl font-light tracking-widest transition-colors ${
                    isActive ? 'text-gold' : 'text-charcoal hover:text-gold'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center justify-center gap-6 pb-8">
            <a href="https://www.instagram.com/snaart2026/" target="_blank" rel="noopener noreferrer" className="text-charcoal hover:text-gold">
              <Instagram size={22} />
            </a>
            <a href="https://www.tiktok.com/@alexandraharataustoe" target="_blank" rel="noopener noreferrer" className="text-charcoal hover:text-gold">
              <TikTokIcon size={22} />
            </a>
          </div>
        </div>
      )}
    </>
  )
}
