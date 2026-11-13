import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../api/axios'
import {
  selectItems,
  selectTotal,
  selectSessionId,
  clearCartState,
} from '../store/cartSlice'

/* ── Inline SVG Icons ─────────────────────────────────────────────────────── */
const TruckIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75M8.25 21h8.25" />
  </svg>
)

const WarehouseIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.25A2.25 2.25 0 0 1 0 18.75V7.5a2.25 2.25 0 0 1 1.096-1.936l9.75-5.625a2.25 2.25 0 0 1 2.308 0l9.75 5.625A2.25 2.25 0 0 1 24 7.5v11.25A2.25 2.25 0 0 1 21.75 21H13.5Z" />
  </svg>
)

const CalcIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm3-6h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm3-6h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008ZM4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.5h7.5" />
  </svg>
)

const CheckCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

const InvoiceIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
)

const SbpIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
  </svg>
)

export default function CheckoutPage() {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()
  const items     = useSelector(selectItems)
  const cartTotal = useSelector(selectTotal)
  const sessionId = useSelector(selectSessionId)

  // Поля формы
  const [form, setForm] = useState({
    name:         '',
    company_name: '',
    phone:        '',
    email:        '',
    delivery_type: 'delivery', // 'delivery' | 'pickup' | 'custom_calc'
    address:      '',
    payment_method: 'invoice', // 'invoice' | 'sbp'
    comment:      '',
  })

  const [agreed, setAgreed]   = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg]     = useState('')

  const totalPositions = items.length
  const totalQuantity = useMemo(() => {
    return items.reduce((sum, it) => sum + (it.quantity || 1), 0)
  }, [items])

  const cartTotalFormatted = Number(cartTotal || 0).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' ₽'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!items.length) {
      setErrorMsg('Ваша корзина пуста. Добавьте товары перед оформлением.')
      return
    }

    if (!form.name.trim()) {
      setErrorMsg('Пожалуйста, укажите контактное лицо (ФИО).')
      return
    }

    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Пожалуйста, укажите корректный номер телефона для связи.')
      return
    }

    if (!form.email.trim() || !form.email.includes('@')) {
      setErrorMsg('Пожалуйста, укажите рабочий E-mail для получения счета и спецификации.')
      return
    }

    if (form.delivery_type === 'delivery' && !form.address.trim()) {
      setErrorMsg('Пожалуйста, укажите город и адрес доставки (или терминала ТК).')
      return
    }

    if (!agreed) {
      setErrorMsg('Необходимо согласие на обработку персональных данных.')
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        session_id:       sessionId,
        customer_name:    form.name.trim(),
        customer_phone:   form.phone.trim(),
        customer_email:   form.email.trim(),
        delivery_address: form.address.trim(),
        company_name:     form.company_name.trim() || null,
        delivery_type:    form.delivery_type,
        payment_method:   form.payment_method,
        comment:          form.comment.trim() || null,
        delivery_cost:    '0.00',
      }

      const { data } = await api.post('/checkout/', payload)

      // Очищаем корзину в стейте
      dispatch(clearCartState())

      // Перенаправляем на страницу успешного заказа
      const orderId = data.order_id
      navigate(`/order/success/${encodeURIComponent(orderId)}`)
    } catch (err) {
      console.error('Ошибка оформления заказа:', err)
      const detail = err.response?.data?.detail
      const message = typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail.map(d => d.msg).join(', ')
          : 'Не удалось отправить заявку. Попробуйте еще раз или свяжитесь с нами по телефону.'
      setErrorMsg(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[#F8FAFC] py-8 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Хлебные крошки и заголовок */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link to="/" className="hover:text-[#C59B6D] transition-colors">Главная</Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Оформление заявки</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl lg:text-4xl text-[#162330]">
            Оформление заявки / Запрос счёта
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Заполните данные для связи и выставления счёта. Менеджер <strong>НАМПАК</strong> свяжется с вами для согласования объёма, доставки и точных условий поставки.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-2xl">
              📦
            </div>
            <h2 className="font-heading font-bold text-lg text-[#162330] mb-2">
              В корзине нет товаров
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Выберите нужную продукцию в каталоге перед оформлением заявки.
            </p>
            <Link
              to="/"
              className="inline-flex px-6 py-3 bg-[#162330] hover:bg-[#1E2F40] text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* ── ЛЕВАЯ КОЛОНКА (ФОРМА) ─────────────────────────── */}
              <div className="lg:col-span-7 space-y-6">

                {/* БЛОК 1: Контактные данные заказчика */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
                  <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-[#162330] text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h2 className="font-heading font-bold text-base md:text-lg text-[#162330]">
                      Данные заказчика и организации
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Контактное лицо (ФИО) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Например: Иванов Иван Сергеевич"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-[#162330] focus:bg-white focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span>Название организации или ИНН</span>
                        <span className="text-[11px] text-slate-400 font-normal">для счёта юрлицам</span>
                      </label>
                      <input
                        type="text"
                        name="company_name"
                        value={form.company_name}
                        onChange={handleChange}
                        placeholder="ООО «Альфа» / ИП Смирнов или ИНН 7701234567"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-[#162330] focus:bg-white focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Телефон для связи <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+7 (999) 000-00-00"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-[#162330] focus:bg-white focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          E-mail для счета и спецификации <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="partner@company.ru"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-[#162330] focus:bg-white focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* БЛОК 2: Способ доставки */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
                  <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-[#162330] text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h2 className="font-heading font-bold text-base md:text-lg text-[#162330]">
                      Способ получения заказа
                    </h2>
                  </div>

                  {/* Карточки-переключатели delivery_type */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    
                    {/* Вариант 1: Доставка ТК / курьером */}
                    <label
                      className={`p-4 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                        form.delivery_type === 'delivery'
                          ? 'border-[#C59B6D] bg-[#FAF5EF]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery_type"
                        value="delivery"
                        checked={form.delivery_type === 'delivery'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between mb-2">
                        <TruckIcon className={form.delivery_type === 'delivery' ? 'text-[#C59B6D]' : 'text-slate-400'} />
                        {form.delivery_type === 'delivery' && (
                          <CheckCircleIcon className="w-4 h-4 text-[#C59B6D]" />
                        )}
                      </div>
                      <div>
                        <div className="font-heading font-bold text-xs text-[#162330]">
                          Транспортная компания
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 leading-tight">
                          До терминала или адреса заказчика по всей РФ
                        </div>
                      </div>
                    </label>

                    {/* Вариант 2: Самовывоз */}
                    <label
                      className={`p-4 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                        form.delivery_type === 'pickup'
                          ? 'border-[#C59B6D] bg-[#FAF5EF]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery_type"
                        value="pickup"
                        checked={form.delivery_type === 'pickup'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between mb-2">
                        <WarehouseIcon className={form.delivery_type === 'pickup' ? 'text-[#C59B6D]' : 'text-slate-400'} />
                        {form.delivery_type === 'pickup' && (
                          <CheckCircleIcon className="w-4 h-4 text-[#C59B6D]" />
                        )}
                      </div>
                      <div>
                        <div className="font-heading font-bold text-xs text-[#162330]">
                          Самовывоз со склада
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 leading-tight">
                          Бесплатно со склада НАМПАК по согласованию
                        </div>
                      </div>
                    </label>

                    {/* Вариант 3: Индивидуальный расчет */}
                    <label
                      className={`p-4 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                        form.delivery_type === 'custom_calc'
                          ? 'border-[#C59B6D] bg-[#FAF5EF]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery_type"
                        value="custom_calc"
                        checked={form.delivery_type === 'custom_calc'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between mb-2">
                        <CalcIcon className={form.delivery_type === 'custom_calc' ? 'text-[#C59B6D]' : 'text-slate-400'} />
                        {form.delivery_type === 'custom_calc' && (
                          <CheckCircleIcon className="w-4 h-4 text-[#C59B6D]" />
                        )}
                      </div>
                      <div>
                        <div className="font-heading font-bold text-xs text-[#162330]">
                          Индивидуальный расчёт
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 leading-tight">
                          Подбор выгодной попутной машины или сборного груза
                        </div>
                      </div>
                    </label>

                  </div>

                  {/* Поле адреса */}
                  {form.delivery_type !== 'pickup' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Город и адрес доставки (или терминала ТК) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        required={form.delivery_type === 'delivery'}
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Например: г. Санкт-Петербург, Лиговский пр-т, д. 50 или терминал Деловые Линии"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-[#162330] focus:bg-white focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                      />
                    </div>
                  )}

                  {form.delivery_type === 'pickup' && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                      <span className="text-[#C59B6D] text-base leading-none">📍</span>
                      <div>
                        <strong>Адрес склада НАМПАК:</strong> адрес и удобное время забора заказа подтвердит менеджер сразу после сборки партии.
                      </div>
                    </div>
                  )}
                </div>

                {/* БЛОК 3: Способ оплаты и комментарий */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
                  <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-[#162330] text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h2 className="font-heading font-bold text-base md:text-lg text-[#162330]">
                      Способ оплаты и примечания
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    
                    {/* Оплата по счёту */}
                    <label
                      className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                        form.payment_method === 'invoice'
                          ? 'border-[#C59B6D] bg-[#FAF5EF]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value="invoice"
                        checked={form.payment_method === 'invoice'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <InvoiceIcon className={form.payment_method === 'invoice' ? 'text-[#C59B6D]' : 'text-slate-400'} />
                      <div className="flex-1">
                        <div className="font-heading font-bold text-xs text-[#162330]">
                          Безналичный расчёт по счёту
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Для юридических лиц и ИП с предоставлением УПД
                        </div>
                      </div>
                    </label>

                    {/* Оплата по реквизитам / СБП */}
                    <label
                      className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                        form.payment_method === 'sbp'
                          ? 'border-[#C59B6D] bg-[#FAF5EF]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value="sbp"
                        checked={form.payment_method === 'sbp'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <SbpIcon className={form.payment_method === 'sbp' ? 'text-[#C59B6D]' : 'text-slate-400'} />
                      <div className="flex-1">
                        <div className="font-heading font-bold text-xs text-[#162330]">
                          Реквизиты / QR-код СБП
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Быстрая оплата после согласования с менеджером
                        </div>
                      </div>
                    </label>

                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Комментарий или особые пожелания к заявке
                    </label>
                    <textarea
                      rows={3}
                      name="comment"
                      value={form.comment}
                      onChange={handleChange}
                      placeholder="Укажите нужные точные размеры, требуемый тираж партии, необходимость нанесения логотипа или срочность отгрузки..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-[#162330] focus:bg-white focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all resize-y"
                    />
                  </div>

                  <div className="pt-4 flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="agreed"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 rounded text-[#C59B6D] focus:ring-[#C59B6D]"
                    />
                    <label htmlFor="agreed" className="text-xs text-slate-600 leading-snug cursor-pointer">
                      Я подтверждаю корректность указанных данных и согласен на обработку персональных данных в соответствии с{' '}
                      <Link to="/privacy" target="_blank" className="text-[#C59B6D] underline">
                        Политикой конфиденциальности
                      </Link>.
                    </label>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                    ⚠️ {errorMsg}
                  </div>
                )}

              </div>

              {/* ── ПРАВАЯ КОЛОНКА (СОСТАВ ЗАЯВКИ И САБМИТ) ─────── */}
              <div className="lg:col-span-5 sticky top-20 space-y-6">
                
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-7 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <h3 className="font-heading font-extrabold text-base text-[#162330]">
                      Состав заявки
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {totalPositions} поз. ({totalQuantity.toLocaleString('ru-RU')} шт.)
                    </span>
                  </div>

                  {/* Список товаров */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 pr-1">
                    {items.map((it) => (
                      <div key={it.product_id} className="py-3 flex items-start justify-between gap-3 text-xs">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[#162330] line-clamp-2">
                            {it.name}
                          </div>
                          <div className="text-slate-400 text-[11px] mt-0.5">
                            {it.dimensions_mm && <span className="mr-1">{it.dimensions_mm}</span>}
                            {it.material_specs && <span className="mr-1 font-semibold text-[#926435]">[{it.material_specs}]</span>}
                            <span>× {it.quantity.toLocaleString('ru-RU')} шт.</span>
                          </div>
                        </div>
                        <div className="font-heading font-bold text-[#162330] whitespace-nowrap">
                          {Number(it.subtotal || 0).toLocaleString('ru-RU', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} ₽
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Итоговая сумма */}
                  <div className="border-t border-slate-200 pt-4 mt-4 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Сумма по каталогу:
                      </span>
                      <span className="font-heading font-black text-2xl text-[#162330]">
                        {cartTotalFormatted}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      При заказе крупных партий менеджер рассчитает индивидуальную скидку на тираж.
                    </p>
                  </div>

                  {/* Кнопка отправки */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-[#C59B6D] to-[#B08455] hover:from-[#B08455] hover:to-[#9A7244]
                               text-white font-heading font-bold text-sm tracking-wider uppercase rounded-xl shadow-md
                               transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98
                               disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span>Отправка заявки...</span>
                    ) : (
                      <>
                        <span>Отправить заявку менеджеру</span>
                        <span>→</span>
                      </>
                    )}
                  </button>

                  <div className="mt-4 p-3 bg-[#FAF5EF] rounded-xl border border-[#E8D8C5] text-[11px] text-[#926435] leading-relaxed">
                    ⏱️ <strong>Что будет дальше:</strong> Менеджер проверит наличие и объём партии на складе, свяжется с вами для согласования логистики и выставит официальный счёт на оплату.
                  </div>
                </div>

              </div>

            </div>
          </form>
        )}

      </div>
    </div>
  )
}
