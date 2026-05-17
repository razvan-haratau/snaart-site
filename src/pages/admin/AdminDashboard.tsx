import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Package, Users, TrendingUp, ArrowRight } from 'lucide-react'
import { useProductsStore } from '../../store/productsStore'
import { useOrdersStore } from '../../store/ordersStore'

export default function AdminDashboard() {
  const { products, fetchProducts } = useProductsStore()
  const { orders, fetchOrders } = useOrdersStore()

  useEffect(() => {
    fetchProducts()
    fetchOrders()
  }, [fetchProducts, fetchOrders])

  const totalRevenue = orders
    .filter((o) => o.payment_status === 'paid')
    .reduce((sum, o) => sum + o.total, 0)

  const newOrders = orders.filter((o) => o.order_status === 'Nouă').length
  const activeProducts = products.filter((p) => p.status === 'active').length

  const kpis = [
    { label: 'Venituri totale', value: `${totalRevenue.toLocaleString('ro-RO')} RON`, icon: TrendingUp, href: '/admin/rapoarte' },
    { label: 'Comenzi noi', value: newOrders, icon: ShoppingBag, href: '/admin/comenzi' },
    { label: 'Lucrări active', value: activeProducts, icon: Package, href: '/admin/lucrari' },
    { label: 'Total clienți', value: new Set(orders.map((o) => o.customer_email)).size, icon: Users, href: '/admin/clienti' },
  ]

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <p className="font-serif text-2xl font-light text-charcoal">Dashboard</p>
        <p className="text-brand-muted text-sm mt-1">Bine ai revenit la SNAART Admin</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} to={href} className="bg-white p-5 border border-cream-darker hover:border-gold transition-colors group">
            <div className="flex items-start justify-between mb-3">
              <Icon size={18} className="text-gold" strokeWidth={1.5} />
              <ArrowRight size={12} className="text-brand-muted group-hover:text-gold transition-colors" />
            </div>
            <p className="font-serif text-2xl font-light text-charcoal">{value}</p>
            <p className="text-xs tracking-wider text-brand-muted mt-1 uppercase font-sans">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-cream-darker">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-darker">
          <p className="font-sans font-medium text-charcoal text-sm">Comenzi recente</p>
          <Link to="/admin/comenzi" className="text-xs text-gold hover:underline tracking-wider">
            Vezi toate
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-center text-brand-muted text-sm py-8">Nicio comandă încă</p>
        ) : (
          <div className="divide-y divide-cream-darker">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-charcoal">{order.id}</p>
                  <p className="text-xs text-brand-muted">{order.customer_name} — {order.customer_email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-charcoal">{order.total.toLocaleString('ro-RO')} RON</p>
                  <span className={`text-xs px-2 py-0.5 ${
                    order.order_status === 'Nouă' ? 'bg-blue-50 text-blue-600' :
                    order.order_status === 'Livrată' ? 'bg-emerald-50 text-emerald-600' :
                    order.order_status === 'Anulată' ? 'bg-red-50 text-red-500' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {order.order_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
