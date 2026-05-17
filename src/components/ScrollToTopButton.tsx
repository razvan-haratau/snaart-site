import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Înapoi sus"
      className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-gold text-white flex items-center justify-center hover:bg-gold-dark transition-colors shadow-gold"
    >
      <ArrowUp size={18} />
    </button>
  )
}
