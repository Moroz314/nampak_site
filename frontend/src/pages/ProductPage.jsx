import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/axios'
import { addToCart, selectAdding, selectSessionId } from '../store/cartSlice'

const ImagePlaceholder = ({ name }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-3">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-slate-300">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5
           1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5
           0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5
           1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375
           0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
    <span className="text-xs font-heading font-bold uppercase tracking-widest text-slate-400">
      НАМПАК
    </span>
  </div>
)

const TgIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)

const MaxIcon = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 720 720"
    fill="currentColor"
    className={`${className.includes('text-') ? '' : 'text-[#7C3AED]'} ${className} inline-block flex-shrink-0`}
    aria-hidden="true"
  >
    <path d="M350.4,9.6C141.8,20.5,4.1,184.1,12.8,390.4c3.8,90.3,40.1,168,48.7,253.7,2.2,22.2-4.2,49.6,21.4,59.3,31.5,11.9,79.8-8.1,106.2-26.4,9-6.1,17.6-13.2,24.2-22,27.3,18.1,53.2,35.6,85.7,43.4,143.1,34.3,299.9-44.2,369.6-170.3C799.6,291.2,622.5-4.6,350.4,9.6h0ZM269.4,504c-11.3,8.8-22.2,20.8-34.7,27.7-18.1,9.7-23.7-.4-30.5-16.4-21.4-50.9-24-137.6-11.5-190.9,16.8-72.5,72.9-136.3,150-143.1,78-6.9,150.4,32.7,183.1,104.2,72.4,159.1-112.9,316.2-256.4,218.6h0Z"/>
  </svg>
)

function cleanHtmlContent(html) {
  if (!html) return ''
  return html.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ')
}

export default function ProductPage() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const sessionId = useSelector(selectSessionId)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const isAdding = useSelector(state => product ? selectAdding(product.id)(state) : false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    api.get(`/products/${slug}`)
      .then(({ data }) => {
        if (active) {
          setProduct(data)
          // По умолчанию 1 штука
          setQuantity(1)
        }
      })
      .catch(err => {
        if (active) setError(err.response?.status === 404 ? 'Товар не найден' : 'Не удалось загрузить товар')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [slug])

  const minQty = product?.min_order_qty || 1
  const numPrice = Number(product?.price || 0)

  // Сортировка ценовых порогов (оптовые уровни)
  const sortedTiers = useMemo(() => {
    if (!product?.price_tiers || !Array.isArray(product.price_tiers)) return []
    return [...product.price_tiers]
      .filter(t => t && t.min_qty != null && t.price != null && !isNaN(Number(t.min_qty)) && !isNaN(Number(t.price)))
      .map(t => ({ min_qty: Number(t.min_qty), price: Number(t.price) }))
      .sort((a, b) => a.min_qty - b.min_qty)
  }, [product?.price_tiers])

  // Индекс активного ценового уровня для текущего тиража
  const activeTierIndex = useMemo(() => {
    if (sortedTiers.length === 0) return -1
    let idx = 0
    for (let i = 0; i < sortedTiers.length; i++) {
      if (quantity >= sortedTiers[i].min_qty) {
        idx = i
      } else {
        break
      }
    }
    return idx
  }, [sortedTiers, quantity])

  // Актуальная цена за 1 шт. с учётом выбранного тиража
  const currentUnitPrice = useMemo(() => {
    if (sortedTiers.length > 0 && activeTierIndex >= 0) {
      return sortedTiers[activeTierIndex].price
    }
    return numPrice
  }, [sortedTiers, activeTierIndex, numPrice])

  // Расчет общей стоимости выбранного тиража
  const calculatedTotal = currentUnitPrice * quantity
  const priceFormatted = currentUnitPrice.toLocaleString('ru-RU', {
    minimumFractionDigits: currentUnitPrice % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }) + ' ₽'

  const calculatedTotalFormatted = calculatedTotal.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' ₽'

  const handleQtyChange = (delta) => {
    const next = Math.max(1, quantity + delta)
    setQuantity(next)
  }

  const handleManualQty = (val) => {
    let q = parseInt(val, 10)
    if (isNaN(q) || q < 1) q = 1
    if (q > 10000000) q = 10000000
    setQuantity(q)
  }

  const handleAdd = async () => {
    if (isAdding || !product) return
    const result = await dispatch(addToCart({
      sessionId,
      productId: product.id,
      quantity,
    }))
    if (addToCart.fulfilled.match(result)) {
      setAdded(true)
      setTimeout(() => setAdded(false), 2200)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#C59B6D] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500">Загрузка информации о товаре...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 max-w-md mx-auto">
          <p className="text-3xl mb-2">📦</p>
          <h2 className="font-heading font-bold text-lg text-[#162330] mb-2">{error || 'Товар не найден'}</h2>
          <p className="text-xs text-slate-500 mb-6">Возможно, позиция была перемещена или снята с производства.</p>
          <Link to="/" className="px-5 py-2.5 bg-[#162330] text-white rounded-xl text-xs font-semibold">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    )
  }

  const gallery = product.images?.length
    ? product.images
    : (product.image_url ? [{ url: product.image_url, is_cover: true }] : [])
  const activeImage = gallery[activeImageIndex] ?? gallery[0]

  return (
    <div className="bg-[#F8FAFC] py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-[#C59B6D]">Главная</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/?search=${encodeURIComponent(product.category.name)}`} className="hover:text-[#C59B6D]">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-800 font-medium line-clamp-1">{product.name}</span>
        </div>

        {/* Двухколоночный блок товара */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* ── ЛЕВАЯ КОЛОНКА: ФОТОГРАФИИ ────────────────────────── */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-xs">
              {activeImage?.url && !imageError ? (
                <img
                  src={activeImage.url}
                  alt={`${product.name}, фото ${activeImageIndex + 1}`}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImagePlaceholder name={product.name} />
              )}

              {/* Бейджи */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                {product.is_custom_design ? (
                  <span className="bg-[#162330] text-[#E8D8C5] border border-[#C59B6D]/40 text-xs font-heading font-bold px-3 py-1 rounded-lg shadow-sm">
                    🎨 Возможна печать логотипа
                  </span>
                ) : <span />}

                {!product.in_stock && (
                  <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold px-3 py-1 rounded-lg shadow-sm">
                    Изготовление под заказ
                  </span>
                )}
              </div>
            </div>

            {/* Миниатюры галереи */}
            {gallery.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={image.id ?? image.url}
                    type="button"
                    onClick={() => {
                      setImageError(false)
                      setActiveImageIndex(index)
                    }}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${index === activeImageIndex
                        ? 'border-[#C59B6D] ring-2 ring-[#C59B6D]/20'
                        : 'border-slate-200 opacity-70 hover:opacity-100 bg-white'
                      }`}
                  >
                    <img src={image.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── ПРАВАЯ КОЛОНКА: ПАРАМЕТРЫ И ЗАКАЗ ТИРАЖА ──────────── */}
          <div className="lg:col-span-6 space-y-6">

            <div>
              {product.category && (
                <span className="text-xs font-bold uppercase tracking-wider text-[#926435] bg-[#FAF5EF] px-2.5 py-1 rounded-md border border-[#E8D8C5] inline-block mb-3">
                  {product.category.name}
                </span>
              )}
              <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-[#162330] leading-tight mb-3">
                {product.name}
              </h1>
            </div>

            {/* Цена за 1 шт. */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-baseline justify-between shadow-xs">
              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  {sortedTiers.length >= 2 ? `Цена за 1 шт. (при заказе ${quantity.toLocaleString('ru-RU')} шт.):` : 'Базовая цена за 1 шт.:'}
                </span>
                <span className="font-heading font-black text-3xl text-[#162330]">
                  {priceFormatted}
                </span>
              </div>
              {minQty > 1 && (
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-lg font-medium">
                  Мин. тираж: <strong>{minQty.toLocaleString('ru-RU')} шт.</strong>
                </span>
              )}
            </div>

            {/* Градация оптовых цен от объёма (как на референсе) */}
            {sortedTiers.length >= 2 && (
              <div className="bg-[#FAF5EF] rounded-2xl border-2 border-[#E8D8C5] p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#926435]">
                    Оптовые цены от объёма заказа
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Нажмите на строку для выбора
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {sortedTiers.map((tier, idx) => {
                    const isActive = idx === activeTierIndex
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuantity(tier.min_qty)}
                        className={`w-full flex items-baseline justify-between px-3.5 py-2.5 rounded-xl transition-all text-xs sm:text-sm cursor-pointer ${
                          isActive
                            ? 'bg-[#162330] text-white font-bold shadow-xs ring-2 ring-[#C59B6D]/50'
                            : 'bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-200/60'
                        }`}
                      >
                        <span className={`shrink-0 ${isActive ? 'text-[#C59B6D]' : 'text-slate-600'}`}>
                          от {tier.min_qty.toLocaleString('ru-RU')} шт.
                        </span>
                        <span
                          className={`flex-1 border-b border-dotted mx-2 sm:mx-3 mb-1 transition-colors ${
                            isActive ? 'border-[#C59B6D]/70' : 'border-slate-300'
                          }`}
                        />
                        <span className={`shrink-0 font-heading ${isActive ? 'text-white font-extrabold text-sm sm:text-base' : 'text-[#162330] font-bold'}`}>
                          {tier.price.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽
                          <span className={`text-[10px] ml-1 font-normal ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>/ шт.</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Таблица характеристик упаковки */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 mb-3.5 pb-2 border-b border-slate-100">
                Технические характеристики
              </h3>
              <dl className="divide-y divide-slate-100 text-xs">
                {product.dimensions_mm && (
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-slate-500">Габариты / Размеры:</dt>
                    <dd className="font-bold text-[#162330]">{product.dimensions_mm}</dd>
                  </div>
                )}
                {product.material_specs && (
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-slate-500">Материал / Толщина:</dt>
                    <dd className="font-bold text-[#162330]">{product.material_specs}</dd>
                  </div>
                )}
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-500">Минимальный заказ:</dt>
                  <dd className="font-bold text-[#162330]">от {minQty.toLocaleString('ru-RU')} шт.</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-500">Нанесение логотипа:</dt>
                  <dd className="font-bold text-[#C59B6D]">
                    {product.is_custom_design ? '✓ Доступно от 2 000 шт.' : 'По согласованию'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Выбор тиража и добавление в корзину */}
            <div className="bg-white rounded-2xl border-2 border-[#E8D8C5] p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="text-xs font-heading font-bold text-[#162330]">
                  Выберите объём партии (шт.):
                </label>

                {/* Контрол количества */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQtyChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-xl border border-slate-300 text-slate-700 hover:border-[#C59B6D] hover:text-[#C59B6D] flex items-center justify-center font-bold text-lg transition-colors disabled:opacity-40 cursor-pointer active:scale-95"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={quantity}
                    onChange={(e) => handleManualQty(e.target.value)}
                    className="w-24 h-10 text-center font-heading font-bold text-base text-[#162330] border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:border-[#C59B6D] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleQtyChange(1)}
                    className="w-10 h-10 rounded-xl border border-slate-300 text-slate-700 hover:border-[#C59B6D] hover:text-[#C59B6D] flex items-center justify-center font-bold text-lg transition-colors cursor-pointer active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Расчёт суммы за тираж */}
              <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">
                    Сумма за партию ({quantity.toLocaleString('ru-RU')} шт.):
                  </span>
                  {sortedTiers.length >= 2 && (
                    <span className="text-[11px] text-[#926435] font-semibold">
                      по {priceFormatted} / шт.
                    </span>
                  )}
                </div>
                <span className="font-heading font-black text-xl sm:text-2xl text-[#162330]">
                  {calculatedTotalFormatted}
                </span>
              </div>

              {/* Кнопка добавления в корзину */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={isAdding}
                className={`w-full py-4 px-6 rounded-xl font-heading font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 min-h-[48px] ${added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-[#C59B6D] to-[#B08455] hover:from-[#B08455] hover:to-[#9A7244] text-white'
                  }`}
              >
                {isAdding ? (
                  <span>Добавление...</span>
                ) : added ? (
                  <span>✓ Добавлено в корзину ({quantity.toLocaleString('ru-RU')} шт.)</span>
                ) : (
                  <span>Добавить партию в заявку</span>
                )}
              </button>
            </div>

            {/* Блок индивидуального заказа и брендирования */}
            <div className="bg-[#FAF5EF] rounded-2xl border border-[#E8D8C5] p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#926435]">
                <span>🎨</span>
                <span>Нужен нестандартный размер или нанесение логотипа?</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Изготовим упаковку с вашей фирменной символикой  по запросу и предоставлению полной информации, в т.ч. Макета. Напишите менеджеру для расчёта:
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-1">
                <a
                  href="https://t.me/namupak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  <TgIcon />
                  <span>Telegram</span>
                </a>
                <a
                  href="https://max.ru/join/CNMJPGqDX3nDW430jTIt4Ft1HDnfe-j1uSjygxIxgRg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  <MaxIcon className="w-5 h-5" />
                  <span>Max</span>
                </a>
                <a
                  href="tel:+79931176492"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-slate-300 hover:border-[#C59B6D] text-[#162330] rounded-xl text-xs font-semibold shadow-xs"
                >
                  <span>📞 +7 (993) 117-64-92</span>
                </a>
              </div>
            </div>

            {/* Описание товара */}
            {product.description && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <h3 className="font-heading font-bold text-sm text-[#162330] mb-3">
                  Описание и применение
                </h3>
                {/[a-z][\s\S]*>/i.test(product.description) ? (
                  <div
                    className="article-html-content text-xs text-slate-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: cleanHtmlContent(product.description) }}
                  />
                ) : (
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}
