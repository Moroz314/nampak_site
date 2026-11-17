import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  loginUser,
  clearUserError,
  selectIsAuthenticated,
  selectUserLoading,
  selectUserError,
} from '../store/userSlice'
import { selectSessionId } from '../store/cartSlice'

const EyeIcon = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
)

const EyeSlashIcon = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
)

const CheckIcon = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
)

export default function LoginPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const dispatch  = useDispatch()

  const isAuthenticated = useSelector(selectIsAuthenticated)
  const loading         = useSelector(selectUserLoading)
  const error           = useSelector(selectUserError)
  const sessionId       = useSelector(selectSessionId)

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Редирект если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/account'
      navigate(from, { replace: true })
    }
    return () => {
      dispatch(clearUserError())
    }
  }, [isAuthenticated, navigate, location.state, dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) return

    dispatch(loginUser({ email: email.trim(), password, sessionId }))
  }

  return (
    <div className="min-h-[75vh] bg-slate-50/70 py-8 sm:py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Хлебные крошки */}
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-[#C59B6D] transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">Вход в личный кабинет</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Левая колонка: Форма входа */}
          <div className="p-6 sm:p-8 md:p-10 lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF5EF] text-[#C59B6D] border border-[#E8D8C5] mb-3">
                <span>Личный кабинет покупателя</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#162330] tracking-tight mb-2">
                Вход в аккаунт
              </h1>
              <p className="text-sm text-slate-500 mb-6">
                Введите e-mail и пароль для доступа к заказам и сохранённым реквизитам.
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                  <span className="text-base font-bold leading-none mt-0.5">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ваш E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.ru"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Пароль <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Введите пароль"
                      className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                    >
                      {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#162330] hover:bg-[#1E2F40] active:scale-[0.99] text-white font-heading font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Выполняем вход...</span>
                      </>
                    ) : (
                      <span>Войти в личный кабинет</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
              <span>Забыли пароль или возникли вопросы?</span>
              <a href="tel:+79931176492" className="text-[#C59B6D] font-bold hover:underline">
                +7 (993) 117-64-92
              </a>
            </div>
          </div>

          {/* Правая колонка: Преимущества (zippack-стиль) */}
          <div className="bg-[#FAF5EF] p-6 sm:p-8 md:p-10 lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[#E8D8C5]/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#C59B6D]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#C59B6D]">
                  Для постоянных клиентов
                </span>
              </div>
              
              <h2 className="text-xl font-heading font-black text-[#162330] tracking-tight mb-4">
                Преимущества кабинета НАМПАК
              </h2>

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700 mb-8">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-white text-[#C59B6D] border border-[#E8D8C5] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                    <CheckIcon className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <strong className="text-[#162330] block">Синхронизация корзины</strong>
                    Товары сохраняются в аккаунте и доступны с любого ПК или телефона.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-white text-[#C59B6D] border border-[#E8D8C5] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                    <CheckIcon className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <strong className="text-[#162330] block">История всех заявок и счетов</strong>
                    Все тиражи, спецификации и статусы отгрузки в одном удобном списке.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-white text-[#C59B6D] border border-[#E8D8C5] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                    <CheckIcon className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <strong className="text-[#162330] block">Повтор заказа в 1 клик</strong>
                    Мгновенное формирование повторной партии регулярной тары.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-white text-[#C59B6D] border border-[#E8D8C5] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                    <CheckIcon className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <strong className="text-[#162330] block">Автозаполнение для юрлиц</strong>
                    Сохранение реквизитов организации, ИНН и закрывающие через ЭДО.
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-[#E8D8C5]/70">
              <p className="text-xs text-slate-600 mb-3 font-medium">Ещё нет личного кабинета?</p>
              <Link
                to="/register"
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-[#C59B6D] text-[#162330] hover:text-[#C59B6D] font-heading font-bold text-xs uppercase tracking-wider text-center block transition-all shadow-xs"
              >
                Создать аккаунт покупателя
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
