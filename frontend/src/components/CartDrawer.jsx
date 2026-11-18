import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  closeDrawer,
  removeFromCart,
  updateQuantity,
  selectIsOpen,
  selectItems,
  selectTotal,
  selectLoading,
  selectSessionId,
} from '../store/cartSlice'

/* ── Иконки ─────────────────────────────────────────────────────────────── */
const XIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
)

const TrashIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.6} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
)

const CartEmptyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.2} stroke="currentColor" className="w-16 h-16 text-slate-300">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
)

/* ── Позиция в корзине ───────────────────────────────────────────────────── */
function CartItem({ item }) {
  const dispatch  = useDispatch()
  const sessionId = useSelector(selectSessionId)
  const loading   = useSelector(selectLoading)

  const [qtyInput, setQtyInput] = useState(item.quantity)

  useEffect(() => {
    setQtyInput(item.quantity)
  }, [item.quantity])

  const handleRemove = () => {
    dispatch(removeFromCart({ sessionId, productId: item.product_id }))
  }

  const commitQty = (val) => {
    let q = parseInt(val, 10)
    if (isNaN(q) || q <= 0) q = 1
    if (q > 10000000) q = 10000000
    setQtyInput(q)
    if (q !== item.quantity) {
      dispatch(updateQuantity({ sessionId, productId: item.product_id, quantity: q }))
    }
  }

  const handleStep = (delta) => {
    const next = Math.max(1, item.quantity + delta)
    commitQty(next)
  }

  const priceFormatted = Number(item.price || 0).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' ₽'

  const subtotalFormatted = Number(item.subtotal || 0).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' ₽'

  const sortedTiers = (item.price_tiers || [])
    .filter(t => t && t.min_qty && t.price)
    .map(t => ({ min_qty: Number(t.min_qty), price: Number(t.price) }))
    .sort((a, b) => a.min_qty - b.min_qty)

  const nextTier = sortedTiers.find(t => t.min_qty > item.quantity)
  const diffToNextTier = nextTier ? nextTier.min_qty - item.quantity : 0
  const nextTierPriceFormatted = nextTier ? Number(nextTier.price).toLocaleString('ru-RU', {
    minimumFractionDigits: Number(nextTier.price) % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }) + ' ₽' : ''

  return (
    <li className="py-4 border-b border-slate-100 last:border-0">
      <div className="flex gap-3">
        {/* Миниатюра */}
        <div className="flex-shrink-0 w-16 h-16 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center relative">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-slate-400 font-bold text-xs">
              {item.name ? item.name.slice(0, 2).toUpperCase() : 'УП'}
            </span>
          )}
        </div>

        {/* Описание позиции */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h4 className="font-heading font-semibold text-sm text-[#162330] leading-snug line-clamp-2">
              {item.name}
            </h4>
            
            {/* Спецификация упаковки */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-500">
              {item.dimensions_mm && (
                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-medium">
                  {item.dimensions_mm}
                </span>
              )}
              {item.material_specs && (
                <span className="bg-[#FAF5EF] text-[#926435] px-1.5 py-0.5 rounded border border-[#E8D8C5]">
                  {item.material_specs}
                </span>
              )}
              {item.min_order_qty && item.min_order_qty > 1 && (
                <span className="text-slate-400">
                  от {item.min_order_qty.toLocaleString('ru-RU')} шт.
                </span>
              )}
            </div>
          </div>

          {/* Цена за штуку */}
          <div className="text-xs text-slate-500 mt-1">
            {priceFormatted} <span className="text-slate-400">/ шт.</span>
          </div>
        </div>

        {/* Правая колонка: сумма + изменение количества */}
        <div className="flex flex-col items-end justify-between flex-shrink-0">
          <span className="font-heading font-bold text-sm text-[#162330]">
            {subtotalFormatted}
          </span>

          <div className="flex items-center gap-1.5 mt-2">
            {/* Кнопка минус */}
            <button
              type="button"
              onClick={() => handleStep(-1)}
              disabled={loading || item.quantity <= 1}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200
                         text-slate-600 hover:border-[#C59B6D] hover:text-[#C59B6D]
                         transition-colors disabled:opacity-40 text-sm font-bold cursor-pointer"
              aria-label="Уменьшить количество"
            >
              −
            </button>

            {/* Инпут количества для быстрого ввода оптовых партий */}
            <input
              type="number"
              min="1"
              max="10000000"
              value={qtyInput}
              onChange={(e) => setQtyInput(e.target.value)}
              onBlur={(e) => commitQty(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur()
                }
              }}
              disabled={loading}
              className="w-14 h-7 text-center font-heading font-semibold text-xs text-[#162330]
                         border border-slate-200 rounded-md bg-white focus:border-[#C59B6D] focus:ring-1 focus:ring-[#C59B6D] outline-none"
              aria-label="Количество"
            />

            {/* Кнопка плюс */}
            <button
              type="button"
              onClick={() => handleStep(+1)}
              disabled={loading}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200
                         text-slate-600 hover:border-[#C59B6D] hover:text-[#C59B6D]
                         transition-colors disabled:opacity-40 text-sm font-bold cursor-pointer"
              aria-label="Увеличить количество"
            >
              +
            </button>

            {/* Кнопка удалить */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={loading}
              className="ml-1 w-7 h-7 flex items-center justify-center rounded-md text-slate-400
                         hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40 cursor-pointer"
              aria-label={`Удалить ${item.name} из корзины`}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Подсказка для перехода на следующий оптовый уровень */}
      {nextTier && (
        <div
          onClick={() => commitQty(nextTier.min_qty)}
          className="mt-2 text-[11px] bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 border border-emerald-200/90 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-1.5 cursor-pointer transition-colors"
          title={`Установить объём ${nextTier.min_qty.toLocaleString('ru-RU')} шт.`}
        >
          <span>
            💡 Добавьте ещё <strong>{diffToNextTier.toLocaleString('ru-RU')} шт.</strong>, чтобы цена снизилась до <strong>{nextTierPriceFormatted}/шт.</strong>
          </span>
          <span className="text-[10px] font-bold text-emerald-700 underline uppercase tracking-wider shrink-0">
            Применить
          </span>
        </div>
      )}
    </li>
  )
}

/* ══════════════════════════════════════════════════════════════
   ГЛАВНЫЙ CART DRAWER
   ══════════════════════════════════════════════════════════════ */
export default function CartDrawer() {
  const dispatch  = useDispatch()
  const isOpen    = useSelector(selectIsOpen)
  const items     = useSelector(selectItems)
  const total     = useSelector(selectTotal)
  const navigate  = useNavigate()
  const drawerRef = useRef(null)

  // Закрытие по Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') dispatch(closeDrawer())
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [dispatch])

  // Блокируем скролл body
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const totalFormatted = Number(total || 0).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' ₽'

  const totalPositions = items.length
  const totalQuantity = items.reduce((acc, it) => acc + (it.quantity || 1), 0)

  const handleCheckout = () => {
    dispatch(closeDrawer())
    navigate('/checkout')
  }

  return (
    <>
      {/* ── Затемнение фона ───────────────────────────────────────── */}
      <div
        onClick={() => dispatch(closeDrawer())}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* ── Выдвижная шторка ──────────────────────────────────────── */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Корзина покупателя"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white border-l border-slate-200
                   shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
                     isOpen ? 'translate-x-0' : 'translate-x-full'
                   }`}
      >
        {/* Верхняя акцентная полоса */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#162330] via-[#C59B6D] to-[#B08455] flex-shrink-0" />

        {/* ── Шапка шторки ────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
          <div>
            <h2 className="font-heading font-extrabold text-lg text-[#162330]">
              Корзина заявки
            </h2>
            {totalPositions > 0 && (
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {totalPositions} {totalPositions === 1 ? 'наименование' : totalPositions < 5 ? 'наименования' : 'наименований'} ({totalQuantity.toLocaleString('ru-RU')} шт.)
              </p>
            )}
          </div>
          <button
            onClick={() => dispatch(closeDrawer())}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Закрыть корзину"
          >
            <XIcon />
          </button>
        </div>

        {/* ── Список товаров ──────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <CartEmptyIcon />
              <h3 className="font-heading font-bold text-base text-[#162330] mt-4">
                Ваша корзина пуста
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
                Перейдите в каталог, чтобы выбрать нужные короба, пакеты, скотч или термоэтикетки.
              </p>
              <button
                type="button"
                onClick={() => {
                  dispatch(closeDrawer())
                  navigate('/')
                }}
                className="mt-6 px-6 py-2.5 bg-[#162330] hover:bg-[#1E2F40] text-white rounded-lg text-xs font-heading font-semibold tracking-wide transition-colors"
              >
                В каталог упаковки
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.map((item) => (
                <CartItem key={item.product_id} item={item} />
              ))}
            </ul>
          )}
        </div>

        {/* ── Подвал шторки с итогом и переходом к оформлению ────── */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 px-6 py-5 bg-slate-50 flex-shrink-0 space-y-4">
            
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-slate-600">
                Предварительный итог:
              </span>
              <span className="font-heading font-extrabold text-2xl text-[#162330]">
                {totalFormatted}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              * Окончательный расчёт с учётом скидки за объём и логистики согласует менеджер при выставлении счёта.
            </p>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#C59B6D] to-[#B08455] hover:from-[#B08455] hover:to-[#9A7244]
                         text-white font-heading font-bold text-sm tracking-wider uppercase rounded-xl shadow-sm
                         transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Перейти к оформлению заявки</span>
              <span>→</span>
            </button>
          </div>
        )}

      </aside>
    </>
  )
}
