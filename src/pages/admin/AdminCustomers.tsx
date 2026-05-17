import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useOrdersStore } from '../../store/ordersStore'

export default function AdminCustomers() {
  const { orders, fetchOrders, isLoading } = useOrdersStore()
  const [search, setSearch] = useState('')

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const customerMap = orders.reduce<Record<string, {
    name: string; email: string; phone: string; orders: number; total: number; lastOrder: string
  }>>((acc, o) => {
    const key = o.customer_email
    if (!acc[key]) {
      acc[key] = { name: o.customer_name, email: o.customer_email, phone: o.customer_phone, orders: 0, total: 0, lastOrder: o.created_at }
    }
    acc[key].orders++
    acc[key].total += o.total
    if (o.created_at > acc[key].lastOrder) acc[key].lastOrder = o.created_at
    return acc
  }, {})

  const customers = Object.values(customerMap).filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <p className="font-serif text-2xl font-light text-charcoal">Clienți</p>
        <p className="text-brand-muted text-sm mt-1">{Object.keys(customerMap).length} clienți unici</p>
      </div>

      <div className="relative w-72">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Caută după nume sau email..."
          className="w-full pl-9 pr-4 py-2.5 border border-cream-darker bg-white text-sm outline-none focus:border-gold transition-colors"
        />
      </div>

      <div className="bg-white border border-cream-darker overflow-x-auto">
        {isLoading ? (
          <p className="text-center text-brand-muted py-10 text-sm">Se încarcă...</p>
        ) : customers.length === 0 ? (
          <p className="text-center text-brand-muted py-10 text-sm">Niciun client</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-cream-darker">
              <tr className="text-xs tracking-widest uppercase text-brand-muted">
                <th className="text-left px-4 py-3">Client</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Telefon</th>
                <th className="text-center px-4 py-3">Comenzi</th>
                <th className="text-right px-4 py-3">Total cheltuit</th>
                <th className="text-right px-4 py-3 hidden lg:table-cell">Ultima comandă</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-darker">
              {customers.map((c) => (
                <tr key={c.email} className="hover:bg-cream transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal">{c.name}</p>
                    <p className="text-xs text-brand-muted">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-brand-muted">{c.phone}</td>
                  <td className="px-4 py-3 text-center text-brand-muted">{c.orders}</td>
                  <td className="px-4 py-3 text-right font-medium text-charcoal">{c.total.toLocaleString('ro-RO')} RON</td>
                  <td className="px-4 py-3 text-right hidden lg:table-cell text-brand-muted">{new Date(c.lastOrder).toLocaleDateString('ro-RO')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
