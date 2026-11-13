import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Phone,
  Clock,
  ShoppingBag,
  MapPin,
  Truck,
  Mail,
  Building2,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Package,
  Calendar,
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { adminApi } from '../../api/axios'

/* ── Конфигурация статусов менеджера ───────────────────────────────────────── */
const STATUS_CONFIG = {
  pending:       { label: 'Новая заявка',              color: 'bg-amber-100 text-amber-900 border-amber-300'    },
  confirmed:     { label: 'Подтверждён / Счёт выставлен', color: 'bg-blue-100 text-blue-900 border-blue-300'       },
  in_production: { label: 'В производстве / Комплектуется', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  shipped:       { label: 'Отгружен / В пути',          color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  completed:     { label: 'Завершён',                  color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  cancelled:     { label: 'Отменён',                   color: 'bg-rose-100 text-rose-900 border-rose-300'       },
}

/* ── Допустимые переходы статусов для менеджера ───────────────────────────── */
const NEXT_STATUSES = {
  pending:       ['confirmed', 'cancelled'],
  confirmed:     ['in_production', 'shipped', 'cancelled'],
  in_production: ['shipped', 'cancelled'],
  shipped:       ['completed', 'cancelled'],
  completed:     [],
  cancelled:     [],
}

/* ── Названия способов доставки ───────────────────────────────────────────── */
const DELIVERY_LABELS = {
  pickup:      'Самовывоз со склада (СПб)',
  delivery:    'Доставка ТК / по России',
  custom_calc: 'Индивидуальный расчёт доставки',
}

/* ══════════════════════════════════════════════════════════════
   КАРТОЧКА ЗАКАЗА / ЗАЯВКИ
   ══════════════════════════════════════════════════════════════ */
function OrderCard({ order, onOrderUpdated }) {
  const [loading, setLoading] = useState(false)

  const cfg   = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
  const nexts = NEXT_STATUSES[order.status] || []

  const totalNum = Number(order.total_amount)
  const total = !isNaN(totalNum)
    ? `${totalNum.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`
    : `${order.total_amount} ₽`

  const date = new Date(order.created_at).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const handleStatus = async (status) => {
    setLoading(true)
    try {
      const { data } = await adminApi.patch(`/admin/orders/${order.id}/status`, { status })
      onOrderUpdated(data)
    } catch (err) {
      alert(err.response?.data?.detail ?? 'Ошибка смены статуса')
    } finally {
      setLoading(false)
    }
  }

  const deliveryLabel = DELIVERY_LABELS[order.delivery_type] || order.delivery_type || 'Доставка'

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden transition-shadow hover:shadow-md">
      
      {/* ── Шапка карточки ───────────────────────────────────── */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-black text-sm text-[#162330]">
                {order.order_id}
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock size={13} className="text-slate-400" />
                {date}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-slate-900">{order.guest_name}</span>
              {order.company_name && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF5EF] text-[#B08455] border border-[#E8D8C5]">
                  <Building2 size={12} />
                  {order.company_name}
                </span>
              )}
            </div>
          </div>

          {/* Бейдж статуса */}
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border shadow-2xs ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>

        {/* Контакты клиента */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 pt-3 border-t border-slate-200/60">
          <a
            href={`tel:${order.guest_phone.replace(/\D/g, '')}`}
            className="flex items-center gap-1.5 text-xs font-bold text-[#162330] hover:text-[#C59B6D] transition-colors"
          >
            <Phone size={14} className="text-[#C59B6D]" />
            <span>{order.guest_phone}</span>
          </a>

          {order.guest_email && (
            <a
              href={`mailto:${order.guest_email}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#162330] transition-colors"
            >
              <Mail size={14} className="text-slate-400" />
              <span>{order.guest_email}</span>
            </a>
          )}

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Truck size={14} className="text-slate-400" />
            <span>{deliveryLabel}</span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        
        {/* Адрес доставки или склад */}
        {order.delivery_address && (
          <div className="flex items-start gap-2 bg-[#F8FAFC] p-3 rounded-xl border border-slate-200/60 text-xs">
            <MapPin size={15} className="text-[#C59B6D] shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 uppercase font-bold tracking-wider text-[10px] block">
                Адрес / Город назначения:
              </span>
              <span className="text-slate-800 font-semibold">{order.delivery_address}</span>
            </div>
          </div>
        )}

        {/* Комментарий клиента */}
        {order.client_comment && (
          <div className="flex items-start gap-2 bg-amber-50/60 border border-amber-200/70 p-3 rounded-xl text-xs text-amber-950">
            <FileText size={15} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 block">
                Комментарий к заявке:
              </span>
              <span className="leading-relaxed">{order.client_comment}</span>
            </div>
          </div>
        )}

        {/* ── ТОВАРЫ В ЗАЯВКЕ ─────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Package size={14} className="text-[#C59B6D]" />
              Позиции заявки ({order.items?.length ?? 0})
            </span>
            <span>Кол-во / Сумма</span>
          </div>

          {order.items && order.items.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {order.items.map(item => {
                const itemPriceNum = Number(item.product_price)
                const priceFormatted = !isNaN(itemPriceNum)
                  ? `${itemPriceNum.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`
                  : `${item.product_price} ₽`

                const rowSum = itemPriceNum * item.quantity
                const rowSumFormatted = !isNaN(rowSum)
                  ? `${rowSum.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`
                  : ''

                return (
                  <div key={item.id} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#162330] leading-snug line-clamp-2">
                        {item.product_name}
                      </div>
                      <div className="text-slate-500 font-medium mt-0.5">
                        {priceFormatted} / шт.
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px] inline-block mb-0.5">
                        × {item.quantity.toLocaleString('ru-RU')} шт.
                      </div>
                      <div className="font-bold text-[#162330] text-sm">
                        {rowSumFormatted}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-4 text-xs text-slate-400 italic text-center">
              Позиции не указаны
            </div>
          )}

          {/* Итог */}
          <div className="bg-slate-50/70 p-3.5 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Предварительная сумма партии:
            </span>
            <span className="text-lg font-black text-[#162330]">
              {total}
            </span>
          </div>
        </div>

      </div>

      {/* ── Кнопки перевода статуса ───────────────────────────── */}
      {nexts.length > 0 && (
        <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1">Действие менеджера:</span>
          {nexts.map(statusKey => {
            const nextCfg = STATUS_CONFIG[statusKey]
            const isCancel = statusKey === 'cancelled'
            return (
              <button
                key={statusKey}
                onClick={() => handleStatus(statusKey)}
                disabled={loading}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
                  isCancel
                    ? 'border border-rose-200 bg-white text-rose-600 hover:bg-rose-50'
                    : 'bg-[#162330] hover:bg-[#1E2F40] text-white shadow-xs'
                }`}
              >
                {loading ? '...' : `→ ${nextCfg.label}`}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   ГЛАВНАЯ СТРАНИЦА ЗАЯВОК В АДМИНКЕ
   ══════════════════════════════════════════════════════════════ */
export default function AdminOrders() {
  const [orders,       setOrders]       = useState([])
  const [statusFilter, setStatusFilter] = useState(null)
  const [searchQuery,  setSearchQuery]  = useState('')
  const [loading,      setLoading]      = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = statusFilter ? { status: statusFilter } : {}
      const { data } = await adminApi.get('/admin/orders/', { params })
      setOrders(data)
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  const handleOrderUpdated = (updatedOrder) => {
    setOrders(prev => prev.map(o =>
      o.id === updatedOrder.id ? updatedOrder : o
    ))
  }

  /* Фильтрация по поисковой строке */
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders
    const q = searchQuery.toLowerCase().trim()
    return orders.filter(o =>
      (o.order_id && o.order_id.toLowerCase().includes(q)) ||
      (o.guest_name && o.guest_name.toLowerCase().includes(q)) ||
      (o.guest_phone && o.guest_phone.toLowerCase().includes(q)) ||
      (o.company_name && o.company_name.toLowerCase().includes(q)) ||
      (o.guest_email && o.guest_email.toLowerCase().includes(q))
    )
  }, [orders, searchQuery])

  return (
    <AdminLayout>
      <div className="px-4 py-6 max-w-6xl mx-auto">
        
        {/* Заголовок */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#162330] tracking-tight">
              Заявки и заказы {!loading && <span className="text-slate-400 font-normal text-lg">({orders.length})</span>}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Управление входящими B2B и B2C заявками, выставление счетов и контроль отгрузок
            </p>
          </div>

          {/* Быстрый поиск */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск по номеру, имени, ИНН..."
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Фильтр по статусам */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          <button
            onClick={() => setStatusFilter(null)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === null
                ? 'bg-[#162330] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Все заявки ({orders.length})
          </button>
          {Object.entries(STATUS_CONFIG).map(([key, { label }]) => {
            const count = orders.filter(o => o.status === key).length
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  statusFilter === key
                    ? 'bg-[#162330] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {label} {count > 0 && `(${count})`}
              </button>
            )
          })}
        </div>

        {/* Список заявок */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-48 border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80">
            <ShoppingBag className="w-14 h-14 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {searchQuery ? 'Заявок по запросу не найдено' : 'Заявок пока нет'}
            </h3>
            <p className="text-xs text-slate-500">
              {searchQuery ? 'Попробуйте изменить параметры поиска' : 'Новые заявки с сайта появятся здесь'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onOrderUpdated={handleOrderUpdated}
              />
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  )
}
