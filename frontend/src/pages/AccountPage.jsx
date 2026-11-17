import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userApi } from '../api/axios'
import {
  logoutUser,
  fetchUserProfile,
  updateUserProfile,
  selectCurrentUser,
  selectIsAuthenticated,
} from '../store/userSlice'
import {
  fetchCart,
  openDrawer,
  updateQuantity,
  removeFromCart,
  selectItems,
  selectTotal,
  selectSessionId,
} from '../store/cartSlice'

/* ── Status badges map ────────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  pending: {
    label: 'Новая заявка',
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
  },
  confirmed: {
    label: 'Счёт выставлен',
    bg: 'bg-blue-50 text-blue-800 border-blue-200',
    dot: 'bg-blue-500',
  },
  in_production: {
    label: 'В производстве',
    bg: 'bg-purple-50 text-purple-800 border-purple-200',
    dot: 'bg-purple-500',
  },
  shipped: {
    label: 'Отгружен',
    bg: 'bg-sky-50 text-sky-800 border-sky-200',
    dot: 'bg-sky-500',
  },
  completed: {
    label: 'Завершён',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Отменён',
    bg: 'bg-rose-50 text-rose-800 border-rose-200',
    dot: 'bg-rose-500',
  },
}

/* ── Inline SVG Icons ─────────────────────────────────────────────────────── */
const ClockIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

const RepeatIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
)

const ShoppingBagIcon = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
)

const UserCircleIcon = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
)

const ChevronDownIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
)

const TrashIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
)

const ArrowRightIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
)

export default function AccountPage() {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()

  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user            = useSelector(selectCurrentUser)
  const cartItems       = useSelector(selectItems)
  const cartTotal       = useSelector(selectTotal)
  const sessionId       = useSelector(selectSessionId)

  // Активная вкладка: 'orders' | 'cart' | 'profile'
  const [activeTab, setActiveTab] = useState('orders')

  // Заказы
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [expandedOrders, setExpandedOrders] = useState({})
  const [repeatLoading, setRepeatLoading] = useState(null)
  const [notification, setNotification] = useState('')

  // Форма профиля
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: '',
    company_name: '',
    inn: '',
    edo_operator: '',
    default_delivery_address: '',
  })
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')

  // Смена пароля
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Защита роута: если не авторизован -> на /login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: { pathname: '/account' } } })
    }
  }, [isAuthenticated, navigate])

  // Загружаем профиль и заказы
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile())
      loadOrders()
    }
  }, [isAuthenticated, dispatch])

  // Инициализация формы профиля из текущего пользователя
  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        phone: user.phone || '',
        company_name: user.company_name || '',
        inn: user.inn || '',
        edo_operator: user.edo_operator || '',
        default_delivery_address: user.default_delivery_address || '',
      })
    }
  }, [user])

  const loadOrders = async () => {
    try {
      setLoadingOrders(true)
      const { data } = await userApi.get('/user/orders')
      setOrders(data || [])
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err)
    } finally {
      setLoadingOrders(false)
    }
  }

  const toggleExpandOrder = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  const handleRepeatOrder = async (orderId) => {
    try {
      setRepeatLoading(orderId)
      await userApi.post(`/user/orders/${orderId}/repeat`)
      // Обновляем состояние корзины в Redux
      if (sessionId) {
        await dispatch(fetchCart(sessionId))
      }
      dispatch(openDrawer())
      setNotification(`Товары из заказа ${orderId} добавлены в корзину!`)
      setTimeout(() => setNotification(''), 5000)
    } catch (err) {
      const msg = err.response?.data?.detail ?? 'Не удалось повторить заказ'
      alert(msg)
    } finally {
      setRepeatLoading(null)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setProfileSuccess('')
    setProfileError('')
    setSavingProfile(true)

    try {
      await dispatch(updateUserProfile(profileForm)).unwrap()
      setProfileSuccess('Данные профиля и реквизиты успешно сохранены!')
      setTimeout(() => setProfileSuccess(''), 4000)
    } catch (err) {
      setProfileError(typeof err === 'string' ? err : 'Ошибка при сохранении')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleSavePassword = async (e) => {
    e.preventDefault()
    setPasswordSuccess('')
    setPasswordError('')

    if (passwordForm.new_password.length < 6) {
      setPasswordError('Новый пароль должен содержать не менее 6 символов.')
      return
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('Новые пароли не совпадают.')
      return
    }

    setSavingPassword(true)

    try {
      await dispatch(
        updateUserProfile({
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password,
        })
      ).unwrap()
      setPasswordSuccess('Пароль успешно обновлён!')
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' })
      setTimeout(() => setPasswordSuccess(''), 4000)
    } catch (err) {
      setPasswordError(typeof err === 'string' ? err : 'Ошибка при смене пароля')
    } finally {
      setSavingPassword(false)
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  const cartTotalFormatted = Number(cartTotal || 0).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' ₽'

  return (
    <div className="min-h-[80vh] bg-slate-50/70 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Хлебные крошки */}
        <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-[#C59B6D] transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">Личный кабинет</span>
        </div>

        {/* Уведомление о повторе заказа */}
        {notification && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-600 font-bold text-base">✓</span>
              <span className="font-medium">{notification}</span>
            </div>
            <button
              onClick={() => dispatch(openDrawer())}
              className="text-xs font-bold uppercase text-emerald-800 hover:text-emerald-950 underline ml-4"
            >
              Открыть корзину
            </button>
          </div>
        )}

        {/* Шапка кабинета */}
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#FAF5EF] text-[#C59B6D] border border-[#E8D8C5] flex items-center justify-center font-heading font-black text-xl shadow-2xs">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'Н'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-heading font-black text-[#162330]">
                  {user?.full_name || 'Личный кабинет'}
                </h1>
                {user?.company_name && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF5EF] text-[#C59B6D] border border-[#E8D8C5]">
                    {user.company_name}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>{user?.email}</span>
                {user?.phone && (
                  <>
                    <span>•</span>
                    <span>{user.phone}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-200 hover:border-red-200 transition-all cursor-pointer"
          >
            Выйти из аккаунта
          </button>
        </div>

        {/* Навигационные вкладки */}
        <div className="flex border-b border-slate-200/80 mb-6 gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 pt-1 px-3 sm:px-4 text-xs sm:text-sm font-heading font-bold transition-all relative whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'text-[#162330]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClockIcon className="w-4 h-4 text-[#C59B6D]" />
            <span>История заказов и заявок</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
              {orders.length}
            </span>
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C59B6D] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('cart')}
            className={`pb-3 pt-1 px-3 sm:px-4 text-xs sm:text-sm font-heading font-bold transition-all relative whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'cart'
                ? 'text-[#162330]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBagIcon className="w-4 h-4 text-[#C59B6D]" />
            <span>Моя корзина</span>
            {cartItems.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#C59B6D] text-white">
                {cartItems.length}
              </span>
            )}
            {activeTab === 'cart' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C59B6D] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 pt-1 px-3 sm:px-4 text-xs sm:text-sm font-heading font-bold transition-all relative whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'text-[#162330]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCircleIcon className="w-4 h-4 text-[#C59B6D]" />
            <span>Профиль и реквизиты</span>
            {activeTab === 'profile' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C59B6D] rounded-full" />
            )}
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════
            ВКЛАДКА 1: ИСТОРИЯ ЗАКАЗОВ
            ══════════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80">
                <div className="w-8 h-8 border-3 border-slate-200 border-t-[#C59B6D] rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-500 font-medium">Загружаем историю заявок...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-10 sm:p-14 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#FAF5EF] text-[#C59B6D] flex items-center justify-center mx-auto mb-4 border border-[#E8D8C5]">
                  <ShoppingBagIcon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-heading font-bold text-[#162330] mb-1">
                  У вас пока нет оформленных заявок
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
                  Выберите необходимые упаковочные материалы в каталоге НАМПАК и отправьте заявку на расчёт тиража.
                </p>
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#162330] hover:bg-[#1E2F40] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  <span>Перейти в каталог</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const statusMeta = STATUS_CONFIG[order.status] || {
                  label: order.status,
                  bg: 'bg-slate-100 text-slate-800 border-slate-200',
                  dot: 'bg-slate-400',
                }

                const dateFormatted = new Date(order.created_at).toLocaleString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })

                const isExpanded = !!expandedOrders[order.order_id]
                const itemsCount = (order.items || []).reduce((sum, it) => sum + it.quantity, 0)
                const isRepeating = repeatLoading === order.order_id

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all hover:border-slate-300"
                  >
                    {/* Основная плашка заказа */}
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-heading font-black text-base sm:text-lg text-[#162330] tracking-tight">
                            № {order.order_id}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{dateFormatted}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusMeta.bg}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
                            <span>{statusMeta.label}</span>
                          </span>

                          <span className="font-heading font-black text-base sm:text-lg text-[#162330] whitespace-nowrap ml-2">
                            {Number(order.total_amount || 0).toLocaleString('ru-RU', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{' '}
                            ₽
                          </span>
                        </div>
                      </div>

                      {/* Краткие сведения */}
                      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-600">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Получатель:</span>
                          <span className="font-medium text-slate-800">
                            {order.guest_name}
                            {order.company_name ? ` (${order.company_name})` : ''}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[11px]">Доставка / Адрес:</span>
                          <span className="font-medium text-slate-800 truncate block">
                            {order.delivery_address || 'Самовывоз / Согласование с менеджером'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[11px]">Объём заказа:</span>
                          <span className="font-medium text-slate-800">
                            {order.items?.length || 0} наим. ({itemsCount} шт.)
                          </span>
                        </div>
                      </div>

                      {/* Кнопки управления */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => toggleExpandOrder(order.order_id)}
                          className="text-xs font-bold text-[#162330] hover:text-[#C59B6D] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>{isExpanded ? 'Скрыть состав' : 'Показать состав заказа'}</span>
                          <ChevronDownIcon
                            className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>

                        <button
                          type="button"
                          disabled={isRepeating}
                          onClick={() => handleRepeatOrder(order.order_id)}
                          className="px-4 py-2 rounded-xl bg-[#FAF5EF] hover:bg-[#F3E8DB] border border-[#E8D8C5] text-[#162330] hover:text-[#C59B6D] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isRepeating ? (
                            <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-[#C59B6D] rounded-full animate-spin" />
                          ) : (
                            <RepeatIcon className="w-3.5 h-3.5 text-[#C59B6D]" />
                          )}
                          <span>Повторить заказ</span>
                        </button>
                      </div>
                    </div>

                    {/* Раскрывающийся состав заказа */}
                    {isExpanded && (
                      <div className="bg-slate-50/80 p-4 sm:p-6 border-t border-slate-200/80">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                          Позиции заявки:
                        </h4>
                        <div className="space-y-2.5">
                          {(order.items || []).map((item) => (
                            <div
                              key={item.id}
                              className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/60 flex items-center justify-between gap-4 text-xs"
                            >
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate">{item.product_name}</p>
                                <span className="text-slate-400 text-[11px]">
                                  {Number(item.product_price).toLocaleString('ru-RU')} ₽ / шт.
                                </span>
                              </div>

                              <div className="flex items-center gap-6 flex-shrink-0">
                                <span className="text-slate-600 font-medium">
                                  {item.quantity} шт.
                                </span>
                                <span className="font-heading font-black text-slate-900 whitespace-nowrap min-w-20 text-right">
                                  {(Number(item.product_price) * item.quantity).toLocaleString('ru-RU', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}{' '}
                                  ₽
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {order.comment && (
                          <div className="mt-3.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900">
                            <strong>Примечание клиента:</strong> {order.comment}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            ВКЛАДКА 2: МОЯ КОРЗИНА
            ══════════════════════════════════════════════════════════ */}
        {activeTab === 'cart' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-black text-[#162330]">
                Текущая корзина ({cartItems.length} поз.)
              </h2>
              {cartItems.length > 0 && (
                <span className="text-sm font-bold text-[#C59B6D]">
                  Итого: {cartTotalFormatted}
                </span>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBagIcon className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Корзина пуста</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Добавьте товары из каталога или повторите один из ваших прошлых заказов.
                </p>
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#162330] hover:bg-[#1E2F40] text-white text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Перейти в каталог
                </Link>
              </div>
            ) : (
              <div>
                <div className="divide-y divide-slate-100 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.product_id}
                      className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0 font-bold text-xs">
                            📦
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span>{Number(item.price).toLocaleString('ru-RU')} ₽ / шт.</span>
                            {item.dimensions_mm && (
                              <>
                                <span>•</span>
                                <span>{item.dimensions_mm}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-6 flex-shrink-0">
                        {/* Изменение тиража */}
                        <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  sessionId,
                                  productId: item.product_id,
                                  quantity: item.quantity - 1,
                                })
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors font-bold"
                          >
                            -
                          </button>
                          <span className="w-12 text-center text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  sessionId,
                                  productId: item.product_id,
                                  quantity: item.quantity + 1,
                                })
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>

                        {/* Сумма позиции */}
                        <span className="font-heading font-black text-sm text-[#162330] min-w-24 text-right">
                          {Number(item.subtotal || item.price * item.quantity).toLocaleString('ru-RU', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{' '}
                          ₽
                        </span>

                        {/* Удаление */}
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(removeFromCart({ sessionId, productId: item.product_id }))
                          }
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-slate-100"
                          title="Удалить позицию"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    * Окончательный расчёт логистики и скидки на объём будут согласованы с менеджером.
                  </div>
                  <Link
                    to="/checkout"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#162330] hover:bg-[#1E2F40] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Перейти к оформлению заявки</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            ВКЛАДКА 3: ПРОФИЛЬ И РЕКВИЗИТЫ
            ══════════════════════════════════════════════════════════ */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Левая часть: Контактные данные и реквизиты */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 lg:col-span-7">
              <h3 className="text-lg font-heading font-black text-[#162330] mb-1">
                Контакты и реквизиты организации
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Эти данные автоматически подставляются при оформлении новых заявок.
              </p>

              {profileSuccess && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  ✓ {profileSuccess}
                </div>
              )}

              {profileError && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  ⚠️ {profileError}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ФИО контактного лица
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#C59B6D] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Контактный телефон
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+7 (___) ___-__-__"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#C59B6D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      E-mail (логин)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="p-4 rounded-xl bg-[#FAF5EF]/60 border border-[#E8D8C5] space-y-3">
                    <span className="text-xs font-bold text-[#C59B6D] uppercase tracking-wider block">
                      Юридическое лицо / ИП
                    </span>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Название организации или ИП
                      </label>
                      <input
                        type="text"
                        value={profileForm.company_name}
                        onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })}
                        placeholder="ООО «Компания» или ИП Иванов И. И."
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:border-[#C59B6D] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          ИНН
                        </label>
                        <input
                          type="text"
                          maxLength={12}
                          value={profileForm.inn}
                          onChange={(e) => setProfileForm({ ...profileForm, inn: e.target.value })}
                          placeholder="10 или 12 цифр"
                          className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:border-[#C59B6D] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Оператор ЭДО
                        </label>
                        <input
                          type="text"
                          value={profileForm.edo_operator}
                          onChange={(e) => setProfileForm({ ...profileForm, edo_operator: e.target.value })}
                          placeholder="Диадок, СБИС"
                          className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:border-[#C59B6D] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Основной адрес доставки
                  </label>
                  <textarea
                    rows={2}
                    value={profileForm.default_delivery_address}
                    onChange={(e) => setProfileForm({ ...profileForm, default_delivery_address: e.target.value })}
                    placeholder="г. Санкт-Петербург, Лиговский пр-т, д. 50 или терминал ТК"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#C59B6D] outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 rounded-xl bg-[#162330] hover:bg-[#1E2F40] text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    {savingProfile ? 'Сохраняем...' : 'Сохранить изменения'}
                  </button>
                </div>
              </form>
            </div>

            {/* Правая часть: Безопасность и смена пароля */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 lg:col-span-5 h-fit">
              <h3 className="text-lg font-heading font-black text-[#162330] mb-1">
                Безопасность аккаунта
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Смена пароля для входа в личный кабинет.
              </p>

              {passwordSuccess && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  ✓ {passwordSuccess}
                </div>
              )}

              {passwordError && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  ⚠️ {passwordError}
                </div>
              )}

              <form onSubmit={handleSavePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Текущий пароль
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#C59B6D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Новый пароль
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                    placeholder="Минимум 6 символов"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#C59B6D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Повторите новый пароль
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                    placeholder="Повторите новый пароль"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#C59B6D] outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-[#FAF5EF] text-[#162330] hover:text-[#C59B6D] border border-slate-300 hover:border-[#C59B6D] text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    {savingPassword ? 'Обновляем пароль...' : 'Обновить пароль'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
