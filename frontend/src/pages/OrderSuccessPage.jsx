import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/axios'

/* ── Inline SVG Icons ─────────────────────────────────────────────────────── */
const CheckCircleIcon = ({ className = "w-16 h-16" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

const CopyIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9 9 9 0 0 0-9 9v.876m15 7.124H9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125Z" />
  </svg>
)

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
)

const TgIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

const MaxIcon = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 720 720"
    fill="currentColor"
    className={`${className} inline-block flex-shrink-0`}
    aria-hidden="true"
  >
    <path d="M350.4,9.6C141.8,20.5,4.1,184.1,12.8,390.4c3.8,90.3,40.1,168,48.7,253.7,2.2,22.2-4.2,49.6,21.4,59.3,31.5,11.9,79.8-8.1,106.2-26.4,9-6.1,17.6-13.2,24.2-22,27.3,18.1,53.2,35.6,85.7,43.4,143.1,34.3,299.9-44.2,369.6-170.3C799.6,291.2,622.5-4.6,350.4,9.6h0ZM269.4,504c-11.3,8.8-22.2,20.8-34.7,27.7-18.1,9.7-23.7-.4-30.5-16.4-21.4-50.9-24-137.6-11.5-190.9,16.8-72.5,72.9-136.3,150-143.1,78-6.9,150.4,32.7,183.1,104.2,72.4,159.1-112.9,316.2-256.4,218.6h0Z"/>
  </svg>
)

const PhoneIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
  </svg>
)

const STATUS_LABELS = {
  pending:       'В обработке у менеджера',
  confirmed:     'Подтвержден / Счет выставлен',
  in_production: 'В производстве / Комплектуется',
  shipped:       'Отгружен / Доставляется',
  completed:     'Завершен',
  cancelled:     'Отменен',
}

const DELIVERY_LABELS = {
  delivery:    'Доставка транспортной компанией / курьером',
  pickup:      'Самовывоз со склада',
  custom_calc: 'Индивидуальный расчёт логистики',
}

export default function OrderSuccessPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [settings, setSettings] = useState({
    social_tg: 'https://t.me/namupak',
    social_max: 'https://max.ru/join/CNMJPGqDX3nDW430jTIt4Ft1HDnfe-j1uSjygxIxgRg',
    contact_phone1: '+7 (993) 117-64-92',
    contact_phone2: '+7 (965) 032-61-18',
    contact_email: 'nampack@yandex.ru',
  })

  useEffect(() => {
    // Подгружаем настройки сайта для актуальных контактов
    api.get('/settings/')
      .then(({ data }) => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => {})

    // Подгружаем данные заказа
    if (orderId) {
      api.get(`/orders/${encodeURIComponent(orderId)}/status`)
        .then(({ data }) => setOrder(data))
        .catch(() => {})
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [orderId])

  const copyOrderId = () => {
    if (!orderId) return
    navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tgUrl  = settings.social_tg || 'https://t.me/namupak'
  const maxUrl = settings.social_max || 'https://max.ru/join/CNMJPGqDX3nDW430jTIt4Ft1HDnfe-j1uSjygxIxgRg'
  const phone1 = settings.contact_phone1 || '+7 (993) 117-64-92'
  const phone2 = settings.contact_phone2 || '+7 (965) 032-61-18'

  return (
    <div className="bg-[#F8FAFC] py-12 md:py-20 min-h-[75vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Карточка подтверждения */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 text-center animate-fade-up">
          
          {/* Иконка успеха */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#C59B6D] mb-2 block">
            Заявка зарегистрирована
          </span>

          <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-[#162330] mb-3">
            Спасибо за обращение в НАМПАК!
          </h1>

          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
            Ваша заявка принята в работу. Менеджер свяжется с вами в течение 15–30 минут (в рабочее время) для согласования объёма партии, условий доставки и выставления счёта.
          </p>

          {/* Плашка с номером заказа */}
          <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl mb-8">
            <div className="text-left">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Номер заявки:
              </div>
              <div className="font-heading font-extrabold text-xl text-[#162330] tracking-wide">
                {orderId || 'ORD-NEW'}
              </div>
            </div>

            <button
              onClick={copyOrderId}
              className="p-2 text-slate-400 hover:text-[#C59B6D] hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
              title="Скопировать номер заказа"
            >
              {copied ? <CheckIcon className="w-4 h-4 text-emerald-600" /> : <CopyIcon className="w-4 h-4" />}
            </button>
          </div>

          {/* Детали заказа если подгрузились */}
          {order && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left mb-8 space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Текущий статус:</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

              {order.company_name && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Организация / ИНН:</span>
                  <span className="font-semibold text-[#162330]">{order.company_name}</span>
                </div>
              )}

              {order.delivery_type && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Способ получения:</span>
                  <span className="font-medium text-[#162330]">
                    {DELIVERY_LABELS[order.delivery_type] || order.delivery_type}
                  </span>
                </div>
              )}

              {order.total_amount && (
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Предварительная сумма:</span>
                  <span className="font-heading font-black text-base text-[#162330]">
                    {Number(order.total_amount).toLocaleString('ru-RU', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} ₽
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Блок оперативной связи с менеджером */}
          <div className="border-t border-slate-100 pt-8 mt-2 space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#162330]">
              Хотите ускорить обработку или задать срочный вопрос?
            </h3>
            <p className="text-xs text-slate-500">
              Напишите нам в удобный мессенджер с указанием номера заявки <strong>{orderId}</strong>:
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={tgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-white text-white hover:text-sky-600 border border-sky-500 rounded-xl text-xs font-semibold shadow-xs transition-all group"
              >
                <TgIcon className="w-4 h-4 text-white group-hover:text-sky-600 transition-colors" />
                <span>Написать в Telegram</span>
              </a>

              <a
                href={maxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7C3AED] hover:bg-white text-white hover:text-[#7C3AED] border border-[#7C3AED] rounded-xl text-xs font-semibold shadow-xs transition-all group"
              >
                <MaxIcon className="w-4 h-4 text-white group-hover:text-[#7C3AED] transition-colors" />
                <span>Написать в Max</span>
              </a>

              <a
                href={`tel:${phone1.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 hover:border-[#C59B6D] text-[#162330] rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <PhoneIcon className="w-4 h-4 text-[#C59B6D]" />
                <span>{phone1}</span>
              </a>
            </div>
          </div>

          {/* Кнопка возврата в каталог */}
          <div className="mt-10 pt-6 border-t border-slate-100">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#162330] hover:bg-[#1E2F40] text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>Вернуться в каталог товаров</span>
              <span>→</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  )
}
