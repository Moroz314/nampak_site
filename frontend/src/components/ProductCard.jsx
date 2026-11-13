import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addToCart, selectAdding, selectSessionId } from '../store/cartSlice'

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
  const [added,    setAdded]    = useState(false)
  const [imgError, setImgError] = useState(false)

  const numPrice = Number(product.price || 0)
  // Если цена целая — без копеек, если с копейками — ровно 2 знака
  const priceFormatted = numPrice.toLocaleString('ru-RU', {
    minimumFractionDigits: numPrice % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }) + ' ₽'

  const minQty = product.min_order_qty || 1

  const handleAdd = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isAdding) return
    const result = await dispatch(addToCart({ sessionId, productId: product.id, quantity: minQty }))
    if (addToCart.fulfilled.match(result)) {
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

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
            <span className="bg-[#162330] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              Печать лого
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
      <div className="flex flex-col flex-1 p-5 gap-3">
        
        {/* Категория */}
        {product.category && (
          <span className="text-[11px] font-semibold text-[#926435] uppercase tracking-wider">
            {product.category.name}
          </span>
        )}

        {/* Название товара */}
        <Link
          to={`/product/${product.slug}`}
          className="font-heading font-bold text-[#162330] text-base leading-snug line-clamp-2
                     group-hover:text-[#C59B6D] transition-colors"
        >
          {product.name}
        </Link>

        {/* Упаковочные характеристики: размеры, марка, минимальный тираж */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
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
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
            {stripHtml(product.description)}
          </p>
        )}

        {/* ── Нижняя строка: Цена + Кнопка ───────────────────── */}
        <div className="flex items-center justify-between gap-3 pt-3 mt-auto border-t border-slate-100">
          <div>
            <div className="font-heading font-extrabold text-xl text-[#162330]">
              {priceFormatted}
            </div>
            <div className="text-[10px] text-slate-400">
              {minQty > 1 ? `за 1 шт. (мин. ${minQty} шт.)` : 'за штуку'}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={isAdding}
            aria-label={`Добавить «${product.name}» в корзину`}
            className={`
              px-4 py-2.5 rounded-xl font-heading font-semibold text-xs tracking-wider uppercase
              transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer
              ${added
                ? 'bg-emerald-600 text-white'
                : 'bg-[#162330] hover:bg-[#1E2F40] text-white shadow-xs'
              }
            `}
          >
            {isAdding ? (
              <span>...</span>
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
