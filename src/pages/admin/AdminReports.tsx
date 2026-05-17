import { useEffect } from 'react'
import { useOrdersStore } from '../../store/ordersStore'
import { useProductsStore } from '../../store/productsStore'
import { TrendingUp, ShoppingBag, Package, Users } from 'lucide-react'

export default function AdminReports() {
  const { orders, fetchOrders } = useOrdersStore()
  const { products, fetchProducts } = useProductsStore()

  useEffect(() => {
    fetchOrders()
    fetchProducts()
  }, [fetchOrders, fetchProducts])

  const paidOrders = orders.filter((o) => o.payment_status === 'paid')
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0)
  const avgOrderValue = paidOrders.length ? totalRevenue / paidOrders.length : 0

  const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.order_status] = (acc[o.order_status] || 0) + 1
    return acc
  }, {})

  const byCategory = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})

  const topProducts = [...products]
    .filter((p) => p.status === 'active')
    .sort((a, b) => b.price - a.price)
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <p className="font-serif text-2xl font-light text-charcoal">Rapoarte</p>
        <p className="text-brand-muted text-sm mt-1">Statistici și analiză</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Venituri totale', value: `${totalRevenue.toLocaleString('ro-RO')} RON`, icon: TrendingUp },
          { label: 'Valoare medie comandă', value: `${Math.round(avgOrderValue).toLocaleString('ro-RO')} RON`, icon: ShoppingBag },
          { label: 'Total lucrări', value: products.length, icon: Package },
          { label: 'Clienți unici', value: new Set(orders.map((o) => o.customer_email)).size, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white p-5 border border-cream-darker">
            <Icon size={18} className="text-gold mb-3" strokeWidth={1.5} />
            <p className="font-serif text-2xl font-light text-charcoal">{value}</p>
            <p className="text-xs tracking-wider text-brand-muted mt-1 uppercase font-sans">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Orders by status */}
        <div className="bg-white border border-cream-darker p-6">
          <p className="font-sans font-medium text-charcoal text-sm mb-4">Comenzi per status</p>
          <div className="space-y-3">
            {Object.entries(byStatus).map(([status, count]) => {
              const pct = orders.length ? (count / orders.length) * 100 : 0
              return (
                <div key={status}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-charcoal">{status}</span>
                    <span className="text-brand-muted">{count}</span>
                  </div>
                  <div className="h-1.5 bg-cream-darker">
                    <div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
            {orders.length === 0 && <p className="text-sm text-brand-muted">Nicio comandă</p>}
          </div>
        </div>

        {/* Products by category */}
        <div className="bg-white border border-cream-darker p-6">
          <p className="font-sans font-medium text-charcoal text-sm mb-4">Lucrări per categorie</p>
          <div className="space-y-3">
            {Object.entries(byCategory).map(([cat, count]) => {
              const pct = products.length ? (count / products.length) * 100 : 0
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-charcoal">{cat}</span>
                    <span className="text-brand-muted">{count}</span>
                  </div>
                  <div className="h-1.5 bg-cream-darker">
                    <div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
            {products.length === 0 && <p className="text-sm text-brand-muted">Nicio lucrare</p>}
          </div>
        </div>
      </div>

      {/* Top Products by price */}
      <div className="bg-white border border-cream-darker">
        <div className="px-6 py-4 border-b border-cream-darker">
          <p className="font-sans font-medium text-charcoal text-sm">Lucrări premium</p>
        </div>
        {topProducts.length === 0 ? (
          <p className="text-center text-brand-muted py-8 text-sm">Nicio lucrare</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-cream-darker">
              <tr className="text-xs tracking-widest uppercase text-brand-muted">
                <th className="text-left px-4 py-3">Lucrare</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Categorie</th>
                <th className="text-right px-4 py-3">Preț</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-darker">
              {topProducts.map((p) => (
                <tr key={p.id} className="hover:bg-cream transition-colors">
                  <td className="px-4 py-3 text-charcoal">{p.name}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-brand-muted">{p.category}</td>
                  <td className="px-4 py-3 text-right font-medium text-charcoal">{p.price.toLocaleString('ro-RO')} RON</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
