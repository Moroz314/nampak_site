import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from './ProductCard'
import Hero from './Hero'

/* ── Inline SVG Icons ─────────────────────────────────────────────────────── */
const ChevronDownIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={2} stroke="currentColor" className={`w-4 h-4 flex-shrink-0 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
)

const ChevronRightIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={2.2} stroke="currentColor" className={`w-3.5 h-3.5 flex-shrink-0 ${className}`} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
)

const TgIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

const MaxIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h.01M12 10h.01M16 10h.01" />
  </svg>
)

/* Категориальные иконки */
function getCategoryIcon(name = '') {
  const n = name.toLowerCase()
  if (n.includes('короб') || n.includes('картон')) return '📦'
  if (n.includes('пицц')) return '🍕'
  if (n.includes('скотч') || n.includes('лент')) return '🧻'
  if (n.includes('курьер')) return '✉️'
  if (n.includes('бопп')) return '🛍️'
  if (n.includes('зип') || n.includes('zip')) return '🔒'
  if (n.includes('этикетк') || n.includes('термо')) return '🏷️'
  return '📦'
}

/* ══════════════════════════════════════════════════════════════
   СКЕЛЕТОН КАРТОЧКИ
   ══════════════════════════════════════════════════════════════ */
function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full aspect-[4/3] bg-slate-100" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-4 bg-slate-100 rounded-md w-3/4" />
        <div className="h-3 bg-slate-100 rounded-md w-full" />
        <div className="h-3 bg-slate-100 rounded-md w-4/6" />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div className="h-6 bg-slate-100 rounded-md w-1/3" />
          <div className="h-8 bg-slate-100 rounded-xl w-1/3" />
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   FAQ БЛОК (АККОРДЕОН как на zippack.ru)
   ══════════════════════════════════════════════════════════════ */
const FAQ_ITEMS = [
  {
    q: 'Как получить оптовую скидку и узнать цену на крупный тираж?',
    a: 'При заказе партий от 5 000 – 10 000 шт. для производств, маркетплейсов и оптовых баз действуют специальные дилерские цены со скидкой до 25%. Вы можете отправить заявку через сайт, указав требуемый объём в комментарии, или связаться с менеджером по телефону +7 (993) 117-64-92 — мы оперативно рассчитаем индивидуальное коммерческое предложение с учётом логистики.',
  },
  {
    q: 'Можно ли изготовить коробки или пакеты по индивидуальным размерам?',
    a: 'Да! Мы изготавливаем самосборные и четырёхклапанные гофрокороба любых размеров из трёхслойного картона марок Т-21, Т-22, Т-23, Т-24 (бурый и белый). Срок производства индивидуальной партии со штанцформой составляет от 3 до 5 рабочих дней.',
  },
  {
    q: 'Можно ли нанести наш логотип на упаковку и скотч?',
    a: 'Да, НАМПАК выполняет профессиональное брендирование: качественная флексопечать на коробках, курьер-пакетах, БОПП и Zip-Lock пакетах с бегунком, а также изготовление брендированного скотча с вашим логотипом и контактными данными. Минимальный тираж брендирования — от 2 000 шт.',
  },
  {
    q: 'Как происходит оплата и доставка заказов?',
    a: 'Мы работаем с юридическими лицами (с НДС и без НДС), ИП и физическими лицами по всей территории России. После отправки заявки на сайте наш менеджер связывается с вами в течение 15–30 минут, подтверждает параметры, согласует удобную транспортную компанию (Деловые Линии, ПЭК, СДЭК, попутный транспорт) и выставляет официальный счёт. Также возможен бесплатный самовывоз со склада.',
  },
]

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (idx) => {
    setOpenIndex(prev => prev === idx ? -1 : idx)
  }

  return (
    <section className="mt-16 md:mt-24 pt-12 md:pt-16 border-t border-slate-200">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C59B6D]">
            Частые вопросы покупателей
          </span>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-[#162330] mt-1.5">
            Ответы на популярные вопросы о продукции и заказах
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Всё, что нужно знать об оптовых поставках, изготовлении на заказ и условиях доставки
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 font-heading font-bold text-sm md:text-base text-[#162330] hover:text-[#C59B6D] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <span className={`p-1 rounded-lg bg-slate-100 text-slate-500 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 bg-[#FAF5EF] text-[#C59B6D]' : ''}`}>
                    <ChevronDownIcon />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-up">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════
   ГЛАВНЫЙ КОМПОНЕНТ CATALOG
   ══════════════════════════════════════════════════════════════ */
export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  const [products, setProducts]             = useState([])
  const [categories, setCategories]         = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState(null)

  /* Загрузка категорий */
  useEffect(() => {
    axios.get('/api/categories/')
      .then(res => setCategories(res.data))
      .catch(() => {})
  }, [])

  /* Загрузка товаров */
  const fetchProducts = useCallback(async (categoryId = null, query = '') => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (categoryId !== null) params.category_id = categoryId
      if (query.trim()) params.search = query.trim()

      const { data } = await axios.get('/api/products/', { params })
      setProducts(data)
    } catch (err) {
      const msg = err.response
        ? `Ошибка сервера: ${err.response.status}`
        : 'Сервер недоступен. Убедитесь что бэкенд запущен.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts(activeCategory, searchQuery)
  }, [activeCategory, searchQuery, fetchProducts])

  const handleCategorySelect = (id) => {
    setActiveCategory(id)
    // Если был поиск, сбрасываем при явном выборе категории
    if (searchQuery) {
      const next = new URLSearchParams(searchParams)
      next.delete('search')
      setSearchParams(next)
    }
  }

  const handleResetSearch = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('search')
    setSearchParams(next)
  }

  const activeCategoryObj = categories.find(c => c.id === activeCategory)

  return (
    <div>
      <Hero />

      <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 scroll-mt-20">
        
        {/* ДВУХКОЛОНОЧНЫЙ МАКЕТ КАТАЛОГА (как на zippack.ru) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── ЛЕВАЯ КОЛОНКА: ВЕРТИКАЛЬНЫЙ САЙДБАР КАТЕГОРИЙ ── */}
          <aside className="lg:col-span-3 sticky top-20 hidden lg:block space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              
              {/* Шапка сайдбара */}
              <div className="px-5 py-4 bg-[#162330] text-white flex items-center justify-between">
                <span className="font-heading font-bold text-sm tracking-wide">
                  Категории упаковки
                </span>
                <span className="text-[11px] text-[#C59B6D] font-bold">
                  {categories.length}
                </span>
              </div>

              {/* Список категорий с иконками и стрелками */}
              <nav className="p-2 space-y-1">
                {/* Кнопка "Все товары" */}
                <button
                  type="button"
                  onClick={() => handleCategorySelect(null)}
                  className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer ${
                    activeCategory === null
                      ? 'bg-[#FAF5EF] text-[#B08455] font-bold border-l-4 border-[#C59B6D]'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                    <span className="text-sm flex-shrink-0">📦</span>
                    <span className="truncate">Все товары каталога</span>
                  </span>
                  <ChevronRightIcon className={activeCategory === null ? 'text-[#C59B6D]' : 'text-slate-300 group-hover:text-slate-500'} />
                </button>

                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer text-left ${
                        isActive
                          ? 'bg-[#FAF5EF] text-[#B08455] font-bold border-l-4 border-[#C59B6D]'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                        <span className="text-sm flex-shrink-0">{getCategoryIcon(cat.name)}</span>
                        <span className="truncate" title={cat.name}>{cat.name}</span>
                      </span>
                      <ChevronRightIcon className={isActive ? 'text-[#C59B6D]' : 'text-slate-300 group-hover:text-slate-500'} />
                    </button>
                  )
                })}
              </nav>

            </div>

            {/* Блок быстрого подбора / консультации в сайдбаре */}
            <div className="bg-[#FAF5EF] rounded-2xl border border-[#E8D8C5] p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#926435]">
                Подбор под ваши задачи
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Не нашли нужный размер коробки или толщину пленки? Рассчитаем изготовление по вашим размерам!
              </p>
              <div className="space-y-1.5 pt-1">
                <a
                  href="tel:+79931176492"
                  className="block font-heading font-bold text-xs text-[#162330] hover:text-[#C59B6D]"
                >
                  +7 (993) 117-64-92
                </a>
                <div className="flex gap-2 pt-1">
                  <a
                    href="https://t.me/namupak"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg py-1.5 text-[11px] font-semibold flex items-center justify-center gap-1 shadow-xs"
                  >
                    <TgIcon />
                    <span>Telegram</span>
                  </a>
                  <a
                    href="https://max.ru/join/CNMJPGqDX3nDW430jTIt4Ft1HDnfe-j1uSjygxIxgRg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-1.5 text-[11px] font-semibold flex items-center justify-center gap-1 shadow-xs"
                  >
                    <MaxIcon />
                    <span>Max</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* ── ПРАВАЯ КОЛОНКА: ТОВАРЫ И ФИЛЬТРЫ ── */}
          <div className="lg:col-span-9 space-y-6">

            {/* Мобильная горизонтальная прокрутка категорий */}
            <div className="lg:hidden flex gap-2 overflow-x-auto scrollbar-none pb-1">
              <button
                type="button"
                onClick={() => handleCategorySelect(null)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold whitespace-nowrap border transition-all ${
                  activeCategory === null
                    ? 'bg-[#162330] text-white border-[#162330]'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                Все товары
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold whitespace-nowrap border transition-all ${
                    activeCategory === cat.id
                      ? 'bg-[#162330] text-white border-[#162330]'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Заголовок текущей категории / поискового запроса */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
              <div>
                <h2 className="font-heading font-extrabold text-xl md:text-2xl text-[#162330]">
                  {searchQuery
                    ? `Поиск: «${searchQuery}»`
                    : activeCategoryObj
                      ? activeCategoryObj.name
                      : 'Вся продукция НАМПАК'
                  }
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Оптово-розничные поставки со склада и изготовление под заказ
                </p>
              </div>

              {searchQuery && (
                <button
                  onClick={handleResetSearch}
                  className="text-xs text-[#C59B6D] hover:underline font-semibold self-start sm:self-center"
                >
                  Сбросить поиск ✕
                </button>
              )}
            </div>

            {/* Ошибка при загрузке */}
            {error && (
              <div className="bg-white rounded-2xl border border-red-200 p-8 text-center text-xs text-red-600">
                {error}
                <div className="mt-3">
                  <button
                    onClick={() => fetchProducts(activeCategory, searchQuery)}
                    className="px-4 py-2 bg-[#162330] text-white rounded-lg text-xs"
                  >
                    Повторить
                  </button>
                </div>
              </div>
            )}

            {/* Сетка товаров */}
            {!error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading
                  ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
                  : products.length > 0
                    ? products.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))
                    : (
                      <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <p className="text-4xl mb-2">📦</p>
                        <h3 className="font-heading font-bold text-base text-[#162330]">
                          {searchQuery ? `По запросу «${searchQuery}» товары не найдены` : 'В данной категории пока нет товаров'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                          Попробуйте выбрать другую категорию или свяжитесь с отделом продаж для заказа нужного тиража.
                        </p>
                        {searchQuery && (
                          <button
                            onClick={handleResetSearch}
                            className="mt-4 px-5 py-2 bg-[#FAF5EF] text-[#926435] border border-[#E8D8C5] rounded-lg text-xs font-semibold"
                          >
                            Показать весь каталог
                          </button>
                        )}
                      </div>
                    )
                }
              </div>
            )}

            {/* Счетчик найденных позиций */}
            {!loading && !error && products.length > 0 && (
              <div className="pt-6 text-center text-xs text-slate-400 font-medium">
                Показано позиций: {products.length}
              </div>
            )}

          </div>

        </div>

        {/* ── FAQ БЛОК ВНИЗУ ГЛАВНОЙ СТРАНИЦЫ (как на zippack.ru) ── */}
        <FaqSection />

      </section>
    </div>
  )
}
