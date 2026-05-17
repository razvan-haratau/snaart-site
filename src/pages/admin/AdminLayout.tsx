import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Settings, LogOut, ExternalLink, Menu, ChevronRight } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import AdminLogin from './AdminLogin'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Lucrări', href: '/admin/lucrari', icon: Package },
  { label: 'Comenzi', href: '/admin/comenzi', icon: ShoppingBag },
  { label: 'Clienți', href: '/admin/clienti', icon: Users },
  { label: 'Rapoarte', href: '/admin/rapoarte', icon: BarChart3 },
  { label: 'Setări', href: '/admin/setari', icon: Settings },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, logout } = useAuthStore()

  if (!isAuthenticated) return <AdminLogin />

  return (
    <div className="min-h-screen bg-cream-dark flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-charcoal z-40 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:block`}>
        <div className="p-6 border-b border-charcoal-lighter">
          <p className="font-serif text-xl tracking-[0.3em] text-cream">SNAART</p>
          <p className="text-[8px] tracking-[0.4em] text-gold uppercase mt-0.5">Art with Soul</p>
          <span className="inline-block mt-2 text-[10px] tracking-widest uppercase text-cream/40 border border-cream/20 px-2 py-0.5">Admin</span>
        </div>

        <nav className="p-4 flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== '/admin' && location.pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-sans transition-all ${
                  isActive
                    ? 'bg-gold/10 text-gold'
                    : 'text-cream/50 hover:bg-charcoal-lighter hover:text-cream'
                }`}
              >
                <item.icon size={16} />
                {item.label}
                {isActive && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-charcoal-lighter space-y-1">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 text-sm text-cream/50 hover:text-cream hover:bg-charcoal-lighter transition-colors"
          >
            <ExternalLink size={16} />
            Vizualizează site-ul
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            Deconectează-te
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-cream-darker h-14 flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-cream-dark transition-colors">
            <Menu size={18} />
          </button>
          <h1 className="font-sans font-medium text-charcoal text-sm">
            {navItems.find((n) => location.pathname === n.href || (n.href !== '/admin' && location.pathname.startsWith(n.href)))?.label || 'Admin'}
          </h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
