import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  toggleDrawer,
  fetchCart,
  selectItemCount,
  selectTotal,
  selectSessionId,
} from '../store/cartSlice'
import CartDrawer from './CartDrawer'
import CookieBanner from './CookieBanner'
import { api } from '../api/axios'

/* ── Inline SVG Icons ─────────────────────────────────────────────────────── */
const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
)

const CartIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.7} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
)

const BurgerIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
)

const XIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
)

const GridIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
)

const TgIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

const MaxIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h.01M12 10h.01M16 10h.01" />
  </svg>
)

const PhoneIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
  </svg>
)

/* ── Дефолтные настройки НАМПАК ────────────────────────────────────────────── */
const DEFAULT_SETTINGS = {
  contact_phone1: '+7 (993) 117-64-92',
  contact_phone2: '+7 (965) 032-61-18',
  contact_email:  'nampack@yandex.ru',
  social_tg:      'https://t.me/namupak',
  social_max:     'https://max.ru/join/CNMJPGqDX3nDW430jTIt4Ft1HDnfe-j1uSjygxIxgRg',
  contact_legal_name: 'НАМПАК — Упаковочные материалы',
}

const NAV_MENU_ITEMS = [
  { to: '/',         label: 'Каталог' },
  { to: '/about',    label: 'О компании' },
  { to: '/payment',  label: 'Оплата и доставка' },
  { to: '/training', label: 'Обучение' },
  { to: '/news',     label: 'Новости' },
  { to: '/gallery',  label: 'Галерея продукции' },
  { to: '/contacts', label: 'Контакты' },
]

/* ══════════════════════════════════════════════════════════════
   1. TOP BAR
   ══════════════════════════════════════════════════════════════ */
function TopBar({ settings }) {
  const tgUrl  = settings.social_tg || DEFAULT_SETTINGS.social_tg
  const maxUrl = settings.social_max || DEFAULT_SETTINGS.social_max
  const email  = settings.contact_email || DEFAULT_SETTINGS.contact_email

  return (
    <div className="bg-slate-100 text-slate-600 text-xs py-1.5 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        <div className="font-medium text-slate-700 flex items-center gap-1.5 text-[10px] sm:text-xs truncate">
          <span>📦 Доставка по всей РФ</span>
          <span className="text-slate-300">•</span>
          <span>Опт и розница</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="hidden sm:inline">Собственное производство</span>
        </div>

        <div className="flex items-center gap-3 text-[10px] sm:text-xs flex-shrink-0">
          <a
            href={tgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-600 hover:text-sky-600 transition-colors"
          >
            <TgIcon className="w-3.5 h-3.5 text-sky-500" />
            <span>Telegram</span>
          </a>
          <a
            href={maxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <MaxIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span>Max</span>
          </a>
          <a
            href={`mailto:${email}`}
            className="text-slate-600 hover:text-nampack-dark transition-colors hidden md:inline"
          >
            {email}
          </a>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   2. MAIN HEADER (Search, Logo, Phones, Cart)
   ══════════════════════════════════════════════════════════════ */
function MainHeader({ settings, onOpenMobileMenu }) {
  const dispatch  = useDispatch()
  const itemCount = useSelector(selectItemCount)
  const cartTotal = useSelector(selectTotal)
  const navigate  = useNavigate()
  const location  = useLocation()

  const [searchQuery, setSearchQuery] = useState('')
  const [logoError, setLogoError] = useState(false)

  // Синхронизируем поисковую строку с URL параметром ?search=
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('search') || ''
    setSearchQuery(q)
  }, [location.search])

  const handleSearchSubmit = (e) => {
    e?.preventDefault()
    const q = searchQuery.trim()
    navigate(q ? `/?search=${encodeURIComponent(q)}` : '/')
  }

  const handleHintClick = (hintText) => {
    setSearchQuery(hintText)
    navigate(`/?search=${encodeURIComponent(hintText)}`)
  }

  const phone1 = settings.contact_phone1 || DEFAULT_SETTINGS.contact_phone1
  const phone2 = settings.contact_phone2 || DEFAULT_SETTINGS.contact_phone2
  const tgUrl  = settings.social_tg || DEFAULT_SETTINGS.social_tg

  const cartTotalFormatted = Number(cartTotal || 0).toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  return (
    <header className="bg-white border-b border-slate-100 py-2.5 sm:py-3 md:py-4">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2.5 sm:gap-4 md:gap-6">
          
          {/* ── ЛОГОТИП ────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group">
            {!logoError ? (
              <img
                src="/logo-nampack.png"
                alt="НАМПАК"
                onError={() => setLogoError(true)}
                className="w-10 h-10 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-lg object-contain shadow-xs border border-slate-100"
              />
            ) : (
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-lg bg-[#162330] text-[#C59B6D] font-extrabold flex items-center justify-center text-base sm:text-lg shadow-xs">
                НП
              </div>
            )}
            <div className="leading-tight">
              <div className="font-heading text-lg sm:text-xl md:text-2xl font-black tracking-tight">
                <span className="text-[#162330]">НАМ</span>
                <span className="text-[#C59B6D]">ПАК</span>
              </div>
              <div className="text-[9px] sm:text-[10px] md:text-[11px] text-slate-500 font-medium tracking-tight whitespace-nowrap">
                Магазин упаковки
              </div>
            </div>
          </Link>

          {/* ── ПОИСКОВАЯ СТРОКА (по центру) ──────────────────── */}
          <div className="hidden lg:flex flex-col flex-1 max-w-xl mx-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по каталогу упаковки..."
                className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl
                           text-sm text-slate-800 placeholder:text-slate-400
                           focus:bg-white focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none
                           transition-all shadow-xs"
              />
              <button
                type="submit"
                aria-label="Искать"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg
                           bg-[#162330] text-white flex items-center justify-center hover:bg-[#1E2F40] transition-colors"
              >
                <SearchIcon className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 overflow-hidden whitespace-nowrap">
              <span className="text-slate-400">Например:</span>
              <button
                type="button"
                onClick={() => handleHintClick('гофрокороб Т-23')}
                className="hover:text-[#C59B6D] underline decoration-dotted transition-colors"
              >
                гофрокороб Т-23
              </button>
              <span>,</span>
              <button
                type="button"
                onClick={() => handleHintClick('курьер-пакеты')}
                className="hover:text-[#C59B6D] underline decoration-dotted transition-colors"
              >
                курьер-пакеты
              </button>
              <span>,</span>
              <button
                type="button"
                onClick={() => handleHintClick('зип-лок')}
                className="hover:text-[#C59B6D] underline decoration-dotted transition-colors"
              >
                зип-лок
              </button>
              <span>,</span>
              <button
                type="button"
                onClick={() => handleHintClick('скотч')}
                className="hover:text-[#C59B6D] underline decoration-dotted transition-colors"
              >
                скотч
              </button>
            </div>
          </div>

          {/* ── ТЕЛЕФОНЫ И СВЯЗЬ ───────────────────────────────── */}
          <div className="hidden sm:flex flex-col items-end leading-tight text-right flex-shrink-0">
            <a
              href={`tel:${phone1.replace(/\D/g, '')}`}
              className="text-[#162330] font-heading font-bold text-sm md:text-base hover:text-[#C59B6D] transition-colors flex items-center gap-1.5"
            >
              <PhoneIcon className="w-3.5 h-3.5 text-[#C59B6D]" />
              <span>{phone1}</span>
            </a>
            {phone2 && (
              <a
                href={`tel:${phone2.replace(/\D/g, '')}`}
                className="text-xs text-slate-600 font-medium hover:text-[#C59B6D] transition-colors mt-0.5"
              >
                {phone2}
              </a>
            )}
            <a
              href={tgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1 mt-0.5"
            >
              <TgIcon className="w-3 h-3" />
              <span>Написать в Telegram</span>
            </a>
          </div>

          {/* ── КНОПКА КОРЗИНЫ И МОБИЛЬНОЕ МЕНЮ ────────────────── */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => dispatch(toggleDrawer())}
              className="relative bg-[#FAF5EF] hover:bg-[#F3E8DB] border border-[#E8D8C5] hover:border-[#C59B6D]
                         text-[#162330] rounded-xl p-2 sm:px-4 sm:py-2.5 flex items-center gap-2.5
                         transition-all shadow-xs cursor-pointer group"
              aria-label={`Корзина, ${itemCount} товаров`}
            >
              <div className="relative text-[#C59B6D] group-hover:scale-105 transition-transform">
                <CartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#162330] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Корзина</span>
                <span className="text-xs sm:text-sm font-bold text-[#162330] whitespace-nowrap">
                  {cartTotalFormatted} ₽
                </span>
              </div>
            </button>

            {/* Бургер для мобильных */}
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 text-slate-700 hover:text-[#162330] rounded-xl border border-slate-200 active:bg-slate-100 transition-colors"
              aria-label="Открыть меню"
            >
              <BurgerIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Мобильная строка поиска */}
        <div className="lg:hidden mt-2.5">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по каталогу упаковки..."
              className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 transition-all shadow-xs"
            />
            <button
              type="submit"
              aria-label="Искать"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#162330] hover:bg-[#1E2F40] text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <SearchIcon className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}

/* ══════════════════════════════════════════════════════════════
   3. NAVBAR (как на zippack.ru)
   ══════════════════════════════════════════════════════════════ */
function Navbar() {
  const navigate = useNavigate()

  const handleCatalogClick = () => {
    navigate('/')
    // плавная прокрутка к блоку каталога если уже на главной
    const el = document.getElementById('catalog-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="bg-white border-b border-slate-200 py-2.5 hidden lg:block sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          
          {/* Кнопка "Каталог товаров" (темная) */}
          <button
            type="button"
            onClick={handleCatalogClick}
            className="bg-[#162330] hover:bg-[#1E2F40] text-white rounded-lg px-5 py-2.5
                       font-heading font-semibold text-sm flex items-center gap-2.5 flex-shrink-0
                       shadow-xs transition-colors cursor-pointer"
          >
            <GridIcon className="w-4 h-4 text-[#C59B6D]" />
            <span>Каталог товаров</span>
          </button>

          {/* Цветная плашка с основными ссылками (градиент крафт/золото) */}
          <div className="flex-1 bg-gradient-to-r from-[#C59B6D] to-[#B08455] text-white rounded-lg px-6 py-2.5 flex items-center justify-between gap-4 font-heading font-medium text-sm shadow-xs overflow-x-auto scrollbar-none">
            {NAV_MENU_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `transition-colors duration-150 whitespace-nowrap hover:text-amber-100 ${
                    isActive ? 'font-bold text-white underline underline-offset-4 decoration-2' : 'text-white/95'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

        </div>
      </div>
    </nav>
  )
}

/* ══════════════════════════════════════════════════════════════
   4. ДВУХЗОННЫЙ ФУТЕР (по образцу zippack.ru)
   ══════════════════════════════════════════════════════════════ */
function Footer({ settings }) {
  const year = new Date().getFullYear()

  const phone1 = settings.contact_phone1 || DEFAULT_SETTINGS.contact_phone1
  const phone2 = settings.contact_phone2 || DEFAULT_SETTINGS.contact_phone2
  const email  = settings.contact_email || DEFAULT_SETTINGS.contact_email
  const tgUrl  = settings.social_tg || DEFAULT_SETTINGS.social_tg
  const maxUrl = settings.social_max || DEFAULT_SETTINGS.social_max
  const legal  = settings.contact_legal_name || DEFAULT_SETTINGS.contact_legal_name

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto pb-14 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* ── ЛЕВАЯ ЧАСТЬ (3 колонки ссылок + логотип и копирайт) ── */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            
            {/* Колонка 1: Каталог */}
            <div>
              <h4 className="font-heading font-bold text-[#162330] text-sm uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                Каталог упаковки
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                <li><Link to="/?search=гофрокороб" className="hover:text-[#C59B6D] transition-colors">Гофрокороба и картон</Link></li>
                <li><Link to="/?search=курьер-пакет" className="hover:text-[#C59B6D] transition-colors">Курьерские пакеты</Link></li>
                <li><Link to="/?search=зип-лок" className="hover:text-[#C59B6D] transition-colors">Zip-Lock и БОПП пакеты</Link></li>
                <li><Link to="/?search=скотч" className="hover:text-[#C59B6D] transition-colors">Скотч и клейкие ленты</Link></li>
                <li><Link to="/?search=термоэтикетки" className="hover:text-[#C59B6D] transition-colors">Термоэтикетки для складов</Link></li>
                <li><Link to="/training" className="hover:text-[#C59B6D] transition-colors font-semibold text-[#B08455]">Упаковка с логотипом →</Link></li>
              </ul>
            </div>

            {/* Колонка 2: Покупателям и юрлицам */}
            <div>
              <h4 className="font-heading font-bold text-[#162330] text-sm uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                Клиентам и юрлицам
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                <li><Link to="/payment" className="hover:text-[#C59B6D] transition-colors">Оплата и доставка</Link></li>
                <li><Link to="/payment" className="hover:text-[#C59B6D] transition-colors">Работа с юрлицами / Счета</Link></li>
                <li><Link to="/warranty" className="hover:text-[#C59B6D] transition-colors">Гарантия и возврат</Link></li>
                <li><Link to="/privacy" className="hover:text-[#C59B6D] transition-colors">Политика конфиденциальности</Link></li>
                <li><Link to="/checkout" className="hover:text-[#C59B6D] transition-colors">Оформить заказ / Запрос счёта</Link></li>
              </ul>
            </div>

            {/* Колонка 3: О компании НАМПАК */}
            <div>
              <h4 className="font-heading font-bold text-[#162330] text-sm uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                О компании НАМПАК
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                <li><Link to="/about" className="hover:text-[#C59B6D] transition-colors">О нас и производстве</Link></li>
                <li><Link to="/training" className="hover:text-[#C59B6D] transition-colors">Обучение и стандарты</Link></li>
                <li><Link to="/gallery" className="hover:text-[#C59B6D] transition-colors">Галерея выполненных работ</Link></li>
                <li><Link to="/news" className="hover:text-[#C59B6D] transition-colors">Новости компании</Link></li>
                <li><Link to="/contacts" className="hover:text-[#C59B6D] transition-colors">Контакты и склад</Link></li>
              </ul>
            </div>

            {/* Копирайт и реквизиты */}
            <div className="sm:col-span-3 pt-6 border-t border-slate-200 text-xs text-slate-500 space-y-1">
              <div className="flex items-center gap-2 font-heading font-bold text-[#162330] text-sm mb-1">
                <span>© {year} НАМПАК. Все права защищены.</span>
              </div>
              <p>Оптово-розничные поставки сертифицированных упаковочных материалов для маркетплейсов, складов и производств.</p>
              {legal && <p className="text-slate-400">{legal}</p>}
            </div>

          </div>

          {/* ── ПРАВАЯ ТЕМНАЯ КОЛОНКА КОНТАКТОВ (bg-[#162330]) ── */}
          <div className="lg:col-span-4 bg-[#162330] text-white p-7 md:p-8 rounded-2xl shadow-xl space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C59B6D] block mb-1">
                Отдел продаж и консультаций
              </span>
              <h3 className="font-heading font-extrabold text-xl md:text-2xl text-white">
                Свяжитесь с нами
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Поможем подобрать нужный типоразмер, рассчитаем оптовую партию или тираж с фирменным логотипом.
              </p>
            </div>

            {/* Телефоны */}
            <div className="space-y-2 pt-1 border-t border-slate-700/60">
              <a
                href={`tel:${phone1.replace(/\D/g, '')}`}
                className="text-lg md:text-xl font-bold font-heading text-white hover:text-[#C59B6D] transition-colors flex items-center gap-2"
              >
                <PhoneIcon className="w-5 h-5 text-[#C59B6D]" />
                <span>{phone1}</span>
              </a>
              {phone2 && (
                <a
                  href={`tel:${phone2.replace(/\D/g, '')}`}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors block pl-7"
                >
                  {phone2}
                </a>
              )}
              <a
                href={`mailto:${email}`}
                className="text-xs text-slate-300 hover:text-[#C59B6D] transition-colors block pl-7 pt-0.5"
              >
                {email}
              </a>
            </div>

            {/* Кнопки мессенджеров (Telegram + Max) */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <a
                href={tgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-600 hover:bg-sky-500 text-white rounded-xl px-3 py-2.5 text-xs font-semibold
                           flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <TgIcon className="w-4 h-4" />
                <span>Telegram</span>
              </a>
              <a
                href={maxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-3 py-2.5 text-xs font-semibold
                           flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <MaxIcon className="w-4 h-4" />
                <span>Max</span>
              </a>
            </div>

            <div className="text-[11px] text-slate-400 border-t border-slate-700/60 pt-3">
              📍 Склад и отгрузка заказов: ежедневно по согласованию с менеджером.
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}

/* ══════════════════════════════════════════════════════════════
   5. STICKY BOTTOM BAR (на десктопе — фишка zippack.ru)
   ══════════════════════════════════════════════════════════════ */
function StickyBottomBar() {
  const itemCount = useSelector(selectItemCount)
  const cartTotal = useSelector(selectTotal)
  const navigate  = useNavigate()
  const location  = useLocation()

  const formattedTotal = Number(cartTotal || 0).toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  const isCheckoutOrSuccess = location.pathname.startsWith('/checkout') || location.pathname.startsWith('/order/success')

  return (
    <>
      {/* Десктопная плашка */}
      <aside
        aria-label="Быстрый заказ"
        className="bg-[#162330] text-white py-2.5 px-6 fixed bottom-0 left-0 right-0 z-40 hidden md:flex items-center justify-between border-t border-slate-700 shadow-[0_-4px_25px_rgba(0,0,0,0.2)]"
      >
        <div className="flex items-center gap-6 text-xs text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="text-[#C59B6D]">📦</span>
            <span>Изготовление под заказ до 5 дней</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#C59B6D]">🎨</span>
            <span>Нанесение вашего логотипа от 2000 шт.</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#C59B6D]">🚚</span>
            <span>Быстрая отгрузка по РФ</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {itemCount > 0 ? (
            <div className="text-xs text-slate-200">
              В корзине: <strong className="text-white">{itemCount} поз.</strong> на сумму{' '}
              <strong className="text-[#C59B6D] text-sm">{formattedTotal} ₽</strong>
            </div>
          ) : (
            <div className="text-xs text-slate-400">Корзина пуста</div>
          )}

          <button
            onClick={() => navigate('/checkout')}
            className="bg-[#C59B6D] hover:bg-[#B08455] active:scale-98 text-white px-5 py-2 rounded-lg font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
          >
            Оформить заявку
          </button>
        </div>
      </aside>

      {/* Мобильная всплывающая плашка корзины */}
      {itemCount > 0 && !isCheckoutOrSuccess && (
        <aside
          aria-label="Быстрый переход в корзину"
          className="md:hidden fixed bottom-3 left-3 right-3 z-40 animate-fade-up"
        >
          <div className="bg-[#162330] text-white px-3.5 py-2.5 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-700/80 backdrop-blur-md">
            <div
              onClick={() => navigate('/checkout')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1 mr-2"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#C59B6D] relative flex-shrink-0">
                <CartIcon className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 bg-[#C59B6D] text-[#162330] text-[9px] font-black rounded-full px-1 min-w-3.5 text-center">
                  {itemCount}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 font-medium leading-none truncate">
                  В корзине: {itemCount} поз.
                </div>
                <div className="text-sm font-heading font-black text-white leading-tight mt-0.5">
                  {formattedTotal} ₽
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="bg-gradient-to-r from-[#C59B6D] to-[#B08455] hover:from-[#B08455] hover:to-[#9A7244] active:scale-95 text-white px-3.5 py-2 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
            >
              <span>Оформить</span>
              <span>→</span>
            </button>
          </div>
        </aside>
      )}
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   6. MOBILE MENU OVERLAY
   ══════════════════════════════════════════════════════════════ */
function MobileMenuDrawer({ isOpen, onClose, settings }) {
  const phone1 = settings.contact_phone1 || DEFAULT_SETTINGS.contact_phone1
  const tgUrl  = settings.social_tg || DEFAULT_SETTINGS.social_tg
  const maxUrl = settings.social_max || DEFAULT_SETTINGS.social_max

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-white border-l border-slate-200 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="font-heading font-bold text-lg text-[#162330]">
            НАМ<span className="text-[#C59B6D]">ПАК</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-800">
            <XIcon />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {NAV_MENU_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#FAF5EF] text-[#C59B6D] font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
          <div className="text-xs text-slate-500">Служба заботы:</div>
          <a
            href={`tel:${phone1.replace(/\D/g, '')}`}
            className="block font-bold text-[#162330] text-sm"
          >
            {phone1}
          </a>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={tgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-600 text-white text-xs py-2 rounded-lg font-medium text-center"
            >
              Telegram
            </a>
            <a
              href={maxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 text-white text-xs py-2 rounded-lg font-medium text-center"
            >
              Max
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   ГЛАВНЫЙ КОМПОНЕНТ LAYOUT
   ══════════════════════════════════════════════════════════════ */
export default function Layout({ children }) {
  const dispatch  = useDispatch()
  const sessionId = useSelector(selectSessionId)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  // Загружаем настройки сайта (телефоны, соцсети, email)
  useEffect(() => {
    api.get('/settings/')
      .then(({ data }) => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => {})
  }, [])

  // Подтягиваем корзину при монтировании
  useEffect(() => {
    dispatch(fetchCart(sessionId))
  }, [dispatch, sessionId])

  return (
    <div className="relative flex flex-col min-h-svh bg-[#F8FAFC] text-[#162330]">
      <TopBar settings={settings} />
      <MainHeader settings={settings} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <Navbar />

      <main className="relative z-10 flex-1 w-full">
        {children}
      </main>

      <Footer settings={settings} />
      <StickyBottomBar />
      <CookieBanner />
      <CartDrawer />
      <MobileMenuDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        settings={settings}
      />
    </div>
  )
}
