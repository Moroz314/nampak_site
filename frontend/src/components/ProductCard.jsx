import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addToCart, openDrawer, selectAdding, selectSessionId, selectItemQtyInCart } from '../store/cartSlice'

const ImagePlaceholder = ({ name }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-slate-300">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5
           1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5
           0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5
           1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375
           0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 text-center">
      НАМПАК
    </span>
  </div>
)

function stripHtml(html) {
  if (!html) return ''
  const clean = html.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ')
  try {
    const doc = new DOMParser().parseFromString(clean, 'text/html')
    return (doc.body.textContent || '').replace(/\s+/g, ' ').trim()
  } catch {
    return clean.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }
}

export default function ProductCard({ product }) {
  const dispatch   = useDispatch()
  const sessionId  = useSelector(selectSessionId)
  const isAdding   = useSelector(selectAdding(product.id))
  const inCartQty  = useSelector(selectItemQtyInCart(product.id))
  const [added,    setAdded]    = useState(false)
  const [imgError, setImgError] = useState(false)

  const isInCart = inCartQty > 0

  const handleAdd = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isAdding) return
    // Если товар уже в корзине — просто открываем корзину
    if (isInCart) {
      dispatch(openDrawer())
      return
    }
    const result = await dispatch(addToCart({ sessionId, productId: product.id, quantity: 1 }))
    if (addToCart.fulfilled.match(result)) {
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }
  const numPrice = Number(product.price || 0)
  // Если цена целая — без копеек, если с копейками — ровно 2 знака
  const priceFormatted = numPrice.toLocaleString('ru-RU', {
    minimumFractionDigits: numPrice % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }) + ' ₽'

  // Оптовые тиры — сортируем по возрастанию min_qty
  const sortedTiers = Array.isArray(product.price_tiers) && product.price_tiers.length > 0
    ? [...product.price_tiers].sort((a, b) => Number(a.min_qty) - Number(b.min_qty))
    : []
  // Есть ли тир с min_qty === 1 (или 0) — чтобы не дублировать базовую цену
  const firstTierIsOne = sortedTiers.length > 0 && Number(sortedTiers[0].min_qty) <= 1
  // Строки для отображения: всегда базовая цена (1 шт.) + оптовые тиры
  // Если первый тир уже на 1 шт. — он заменяет базовую строку
  const priceRows = firstTierIsOne
    ? sortedTiers
    : [{ min_qty: 1, price: numPrice }, ...sortedTiers]
  // Самая низкая цена (для подписи в нижней части карточки)
  const lowestPrice = priceRows.length > 0
    ? Math.min(...priceRows.map(t => Number(t.price)))
    : numPrice
  const lowestPriceFormatted = lowestPrice.toLocaleString('ru-RU', {
    minimumFractionDigits: lowestPrice % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }) + ' ₽'
  const hasTiers = sortedTiers.length > 0

  const minQty = product.min_order_qty || 1

  return (
    <article
      className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden
                 transition-all duration-200 hover:border-[#C59B6D] hover:shadow-brand hover:-translate-y-1"
      aria-label={`Товар: ${product.name}`}
    >
      {/* ── Изображение ───────────────────────────────────────── */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block w-full aspect-[4/3] overflow-hidden bg-slate-50 flex-shrink-0"
      >
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder name={product.name} />
        )}

        {/* Бейджи поверх фото */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          {product.is_custom_design ? (
            <span className="bg-[#162330] text-[#E8D8C5] border border-[#C59B6D]/40 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              Печать логотипа
            </span>
          ) : <span />}

          {!product.in_stock && (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-amber-200 shadow-xs">
              Под заказ
            </span>
          )}
        </div>
      </Link>

      {/* ── Контент ───────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 gap-2.5 sm:gap-3">
        
        {/* Категория */}
        {product.category && (
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#926435] uppercase tracking-wider">
            {product.category.name}
          </span>
        )}

        {/* Название товара */}
        <Link
          to={`/product/${product.slug}`}
          className="font-heading font-bold text-[#162330] text-sm sm:text-base leading-snug line-clamp-2
                     group-hover:text-[#C59B6D] transition-colors"
        >
          {product.name}
        </Link>

        {/* Упаковочные характеристики: размеры, марка, минимальный тираж */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-600">
          {product.dimensions_mm && (
            <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
              {product.dimensions_mm}
            </span>
          )}
          {product.material_specs && (
            <span className="bg-[#FAF5EF] text-[#926435] px-2 py-0.5 rounded font-medium border border-[#E8D8C5]">
              {product.material_specs}
            </span>
          )}
          {minQty > 1 && (
            <span className="text-slate-400">
              партия от {minQty.toLocaleString('ru-RU')} шт.
            </span>
          )}
        </div>

        {/* Краткое описание */}
        {product.description && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {stripHtml(product.description)}
          </p>
        )}

        {/* ── Табличка цен от тиража (всегда, если есть хоть одна строка) ── */}
        <div className="bg-[#FAF5EF]/70 rounded-xl border border-[#E8D8C5] p-2.5 my-1 text-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#926435] pb-1 border-b border-[#E8D8C5]/60">
            <span>Тираж</span>
            <span>Цена за 1 шт.</span>
          </div>
          {priceRows.slice(0, 4).map((row, idx) => {
            const p = Number(row.price)
            const rowPriceFormatted = p.toLocaleString('ru-RU', {
              minimumFractionDigits: p % 1 === 0 ? 0 : 2,
              maximumFractionDigits: 2,
            }) + ' ₽'
            const isBase = Number(row.min_qty) <= 1 && !firstTierIsOne
            return (
              <div key={idx} className="flex items-center justify-between text-[11px] text-slate-700">
                <span className={`font-medium ${isBase ? 'text-slate-500' : 'text-slate-600'}`}>
                  от {Number(row.min_qty).toLocaleString('ru-RU')} шт.
                </span>
                <span className="flex-1 mx-2 border-b border-dotted border-slate-300 mb-0.5" />
                <span className={`font-bold ${idx === 0 ? 'text-slate-600' : 'text-[#162330]'}`}>
                  {rowPriceFormatted}
                </span>
              </div>
            )
          })}
          {priceRows.length > 4 && (
            <div className="text-[10px] text-[#926435] text-right font-medium pt-0.5">
              + ещё {priceRows.length - 4} ур. скидок
            </div>
          )}
        </div>

        {/* ── Нижняя строка: Цена + Кнопка ───────────────────── */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 pt-3 mt-auto border-t border-slate-100">
          <div>
            <div className="font-heading font-extrabold text-lg sm:text-xl text-[#162330]">
              {hasTiers ? `от ${lowestPriceFormatted}` : priceFormatted}
            </div>
            <div className="text-[10px] text-slate-400">
              {hasTiers ? 'оптовая цена от тиража' : (minQty > 1 ? `за 1 шт. (мин. ${minQty} шт.)` : 'за штуку')}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={isAdding}
            aria-label={isInCart ? `Перейти в корзину — «${product.name}»` : `Добавить «${product.name}» в корзину`}
            className={`
              px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-heading font-semibold text-xs tracking-wider uppercase
              transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer flex-shrink-0 min-h-[38px] sm:min-h-[42px]
              ${isInCart
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#162330] hover:bg-[#1E2F40] text-white shadow-xs'
              }
            `}
          >
            {isAdding ? (
              <span>...</span>
            ) : isInCart ? (
              <span>✓ В корзине</span>
            ) : added ? (
              <span>✓ В корзине</span>
            ) : (
              <span>В корзину</span>
            )}
          </button>
        </div>

      </div>
    </article>
  )
}
