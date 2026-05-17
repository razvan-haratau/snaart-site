import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('snaart-cookies')
    if (!accepted) setShow(true)
  }, [])

  const accept = () => {
    localStorage.setItem('snaart-cookies', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-charcoal text-cream p-4 md:p-5 shadow-hover">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm flex-1 text-cream/80">
          Folosim cookie-uri pentru a îmbunătăți experiența ta pe site.{' '}
          <a href="/confidentialitate" className="underline text-gold hover:text-gold-light">
            Află mai mult
          </a>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={accept} className="btn-primary text-xs px-4 py-2">
            Accept
          </button>
          <button
            onClick={() => setShow(false)}
            className="text-cream/60 hover:text-cream transition-colors"
            aria-label="Închide"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
