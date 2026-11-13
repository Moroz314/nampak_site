import { NavLink, useNavigate, Link } from 'react-router-dom'
import { Package, ShoppingBag, FileText, Image as ImageIcon, LogOut, Settings, ExternalLink } from 'lucide-react'
import { clearToken } from '../../api/axios'

const NAV = [
  { to: '/admin/products', label: 'Товары',    Icon: Package     },
  { to: '/admin/orders',   label: 'Заявки',    Icon: ShoppingBag },
  { to: '/admin/content',  label: 'Статьи',    Icon: FileText    },
  { to: '/admin/gallery',  label: 'Галерея',   Icon: ImageIcon   },
  { to: '/admin/settings', label: 'Настройки', Icon: Settings    },
]

export default function AdminLayout({ children }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearToken()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* ── Шапка ──────────────────────────────────────────────── */}
      <header className="bg-[#162330] text-white px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C59B6D] flex items-center justify-center font-black text-[#162330] text-sm shadow-xs">
              Н
            </div>
            <div>
              <div className="text-base font-black tracking-tight leading-none text-white">
                НАМ<span className="text-[#C59B6D]">ПАК</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                Панель управления
              </div>
            </div>
          </div>

          {/* Десктопное меню */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {NAV.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span>На сайт</span>
            <ExternalLink size={13} className="text-[#C59B6D]" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-rose-400 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Выйти"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Выход</span>
          </button>
        </div>
      </header>

      {/* ── Контент ───────────────────────────────────────────── */}
      <main className="flex-1 pb-24 md:pb-12 overflow-y-auto">
        {children}
      </main>

      {/* ── Мобильный Bottom Navigation ───────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg safe-bottom"
           aria-label="Навигация администратора">
        <div className="flex items-stretch h-16">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold
                 transition-colors duration-150 select-none
                 ${isActive
                   ? 'text-[#C59B6D]'
                   : 'text-slate-400 active:text-slate-600'}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`p-1 rounded-xl transition-all duration-150 ${isActive ? 'bg-[#FAF5EF]' : ''}`}>
                    <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
                  </span>
                  <span className="leading-none">{label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* Выход на мобильных */}
          <button
            onClick={handleLogout}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px]
                       font-bold text-slate-400 active:text-rose-500 transition-colors duration-150"
            aria-label="Выйти"
          >
            <span className="p-1 rounded-xl">
              <LogOut size={20} strokeWidth={1.8} />
            </span>
            <span className="leading-none">Выход</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
