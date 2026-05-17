import { useEffect, useState } from 'react'
import { useOrdersStore } from '../../store/ordersStore'
import type { OrderStatus } from '../../types'

const STATUSES: OrderStatus[] = ['Nouă', 'În procesare', 'Expediată', 'Livrată', 'Anulată']

export default function AdminOrders() {
  const { orders, fetchOrders, updateOrderStatus, isLoading } = useOrdersStore()
  const [filter, setFilter] = useState<OrderStatus | ''>('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const filtered = filter ? orders.filter((o) => o.order_status === filter) : orders

  return (
    <div className="space-y-6">
      <div>
        <p className="font-serif text-2xl font-light text-charcoal">Comenzi</p>
        <p className="text-brand-muted text-sm mt-1">{orders.length} comenzi în total</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('')}
          className={`text-xs px-3 py-1.5 border transition-colors ${!filter ? 'border-gold bg-gold text-white' : 'border-cream-darker text-brand-muted hover:border-gold'}`}
        >
          Toate ({orders.length})
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(filter === s ? '' : s)}
            className={`text-xs px-3 py-1.5 border transition-colors ${filter === s ? 'border-gold bg-gold text-white' : 'border-cream-darker text-brand-muted hover:border-gold'}`}
          >
            {s} ({orders.filter((o) => o.order_status === s).length})
          </button>
        ))}
      </div>

      <div className="bg-white border border-cream-darker">
        {isLoading ? (
          <p className="text-center text-brand-muted py-10 text-sm">Se încarcă...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-brand-muted py-10 text-sm">Nicio comandă</p>
        ) : (
          <div className="divide-y divide-cream-darker">
            {filtered.map((order) => (
              <div key={order.id}>
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 cursor-pointer hover:bg-cream transition-colors gap-3"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div>
                    <p className="font-medium text-charcoal text-sm">{order.id}</p>
                    <p className="text-xs text-brand-muted">{order.customer_name} — {order.customer_email}</p>
                    <p className="text-xs text-brand-muted mt-0.5">{new Date(order.created_at).toLocaleDateString('ro-RO')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium text-charcoal text-sm">{order.total.toLocaleString('ro-RO')} RON</p>
                    <select
                      value={order.order_status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs px-2 py-1 border outline-none cursor-pointer ${
                        order.order_status === 'Nouă' ? 'border-blue-200 bg-blue-50 text-blue-600' :
                        order.order_status === 'Livrată' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' :
                        order.order_status === 'Anulată' ? 'border-red-200 bg-red-50 text-red-500' :
                        'border-amber-200 bg-amber-50 text-amber-600'
                      }`}
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {expanded === order.id && (
                  <div className="bg-cream px-5 pb-4 pt-2 grid md:grid-cols-2 gap-6 text-sm border-t border-cream-darker">
                    <div>
                      <p className="text-xs tracking-widest uppercase text-brand-muted mb-2 font-sans">Adresă livrare</p>
                      <p className="text-charcoal">{order.shipping_address.name}</p>
                      <p className="text-brand-muted">{order.shipping_address.street}</p>
                      <p className="text-brand-muted">{order.shipping_address.city}, {order.shipping_address.county}</p>
                      <p className="text-brand-muted">{order.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-xs tracking-widest uppercase text-brand-muted mb-2 font-sans">Produse</p>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-charcoal">
                          <span>{item.product_name} × {item.quantity}</span>
                          <span>{(item.price * item.quantity).toLocaleString('ro-RO')} RON</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-brand-muted mt-2 pt-2 border-t border-cream-darker">
                        <span>Livrare</span>
                        <span>{order.shipping_cost === 0 ? 'Gratuită' : `${order.shipping_cost} RON`}</span>
                      </div>
                      <div className="flex justify-between font-medium text-charcoal mt-1">
                        <span>Total</span>
                        <span>{order.total.toLocaleString('ro-RO')} RON</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
