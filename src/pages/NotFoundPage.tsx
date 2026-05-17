import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 text-center">
      <div>
        <p className="font-serif text-8xl font-light text-gold/30 mb-4">404</p>
        <p className="font-serif text-3xl font-light text-charcoal mb-2">Pagina nu a fost găsită</p>
        <div className="gold-divider" />
        <p className="text-brand-muted text-sm mt-4 mb-8">Pagina pe care o cauți nu există sau a fost mutată.</p>
        <Link to="/" className="btn-outline">Înapoi acasă</Link>
      </div>
    </div>
  )
}
