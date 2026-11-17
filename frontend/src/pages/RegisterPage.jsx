import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  registerUser,
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

const BuildingOfficeIcon = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
  </svg>
)

export default function RegisterPage() {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()

  const isAuthenticated = useSelector(selectIsAuthenticated)
  const loading         = useSelector(selectUserLoading)
  const serverError     = useSelector(selectUserError)
  const sessionId       = useSelector(selectSessionId)

  const [form, setForm] = useState({
    full_name:        '',
    email:            '',
    phone:            '',
    password:         '',
    confirm_password: '',
    company_name:     '',
    inn:              '',
    edo_operator:     '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showB2B, setShowB2B]           = useState(false)
  const [agreed, setAgreed]             = useState(true)
  const [clientError, setClientError]   = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/account', { replace: true })
    }
    return () => {
      dispatch(clearUserError())
    }
  }, [isAuthenticated, navigate, dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setClientError('')

    if (!form.full_name.trim()) {
      setClientError('Пожалуйста, укажите контактное лицо (ФИО).')
      return
    }

    if (!form.email.trim() || !form.email.includes('@')) {
      setClientError('Пожалуйста, укажите корректный E-mail.')
      return
    }

    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) {
      setClientError('Пожалуйста, укажите контактный телефон.')
      return
    }

    if (form.password.length < 6) {
      setClientError('Пароль должен содержать не менее 6 символов.')
      return
    }

    if (form.password !== form.confirm_password) {
      setClientError('Пароли не совпадают. Пожалуйста, проверьте ввод.')
      return
    }

    if (!agreed) {
      setClientError('Необходимо подтвердить согласие на обработку персональных данных.')
      return
    }

    dispatch(
      registerUser({
        full_name:    form.full_name.trim(),
        email:        form.email.trim(),
        phone:        form.phone.trim(),
        password:     form.password,
        company_name: form.company_name.trim() || null,
        inn:          form.inn.trim() || null,
        edo_operator: form.edo_operator.trim() || null,
        session_id:   sessionId,
      })
    )
  }

  const error = clientError || serverError

  return (
    <div className="min-h-[80vh] bg-slate-50/70 py-8 sm:py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Хлебные крошки */}
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-[#C59B6D] transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">Регистрация покупателя</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-10">
          
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF5EF] text-[#C59B6D] border border-[#E8D8C5] mb-3">
              <span>Новый покупатель</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#162330] tracking-tight mb-2">
              Регистрация в НАМПАК
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Создайте аккаунт для сохранения корзины, быстрого повтора заказов и автоматического выставления счетов на организацию.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <span className="text-base font-bold leading-none mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Основные контактные данные */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Контактное лицо (ФИО) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  required
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Иванов Иван Иванович"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Рабочий E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="info@company.ru"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Контактный телефон <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Пароль <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Минимум 6 символов"
                    className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Повторите пароль <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirm_password"
                  required
                  minLength={6}
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="Повторите пароль"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Раскрывающийся блок: Для юридических лиц и ИП */}
            <div className="pt-2">
              <div className="bg-[#FAF5EF]/60 rounded-xl border border-[#E8D8C5] p-4 sm:p-5">
                <button
                  type="button"
                  onClick={() => setShowB2B(!showB2B)}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-lg bg-white text-[#C59B6D] border border-[#E8D8C5] shadow-2xs">
                      <BuildingOfficeIcon className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-sm font-heading font-bold text-[#162330] group-hover:text-[#C59B6D] transition-colors block">
                        Данные организации / ИП (для безналичного расчёта и счетов)
                      </span>
                      <span className="text-xs text-slate-500">
                        {showB2B ? 'Нажмите, чтобы скрыть' : 'Заполните сейчас или позже в профиле'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#C59B6D] uppercase tracking-wider ml-2">
                    {showB2B ? '▲ Скрыть' : '▼ Заполнить'}
                  </span>
                </button>

                {showB2B && (
                  <div className="mt-4 pt-4 border-t border-[#E8D8C5]/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Название компании или ИП
                      </label>
                      <input
                        type="text"
                        name="company_name"
                        value={form.company_name}
                        onChange={handleChange}
                        placeholder="ООО «Упаковка-Сервис» или ИП Иванов И. И."
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        ИНН организации / ИП
                      </label>
                      <input
                        type="text"
                        name="inn"
                        maxLength={12}
                        value={form.inn}
                        onChange={handleChange}
                        placeholder="10 или 12 цифр"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Оператор ЭДО
                      </label>
                      <input
                        type="text"
                        name="edo_operator"
                        value={form.edo_operator}
                        onChange={handleChange}
                        placeholder="Диадок, СБИС, Калуга Астрал"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Согласие */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#C59B6D] focus:ring-[#C59B6D]"
                />
                <span>
                  Я согласен на{' '}
                  <Link to="/privacy" target="_blank" className="text-[#C59B6D] underline hover:text-[#162330]">
                    обработку персональных данных
                  </Link>{' '}
                  и принимаю условия пользовательского соглашения.
                </span>
              </label>
            </div>

            {/* Кнопка создания аккаунта */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#162330] hover:bg-[#1E2F40] active:scale-[0.99] text-white font-heading font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Создаём личный кабинет...</span>
                  </>
                ) : (
                  <span>Зарегистрироваться и войти</span>
                )}
              </button>
            </div>

          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-600">
            <span>Уже есть аккаунт в НАМПАК? </span>
            <Link to="/login" className="text-[#C59B6D] font-bold hover:underline">
              Войти в личный кабинет
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
