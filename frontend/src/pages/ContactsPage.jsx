import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare, ShieldCheck, Building2 } from 'lucide-react'
import { api } from '../api/axios'

/* ── Значения по умолчанию для НАМПАК ─────────────────────────────────────── */
const DEFAULTS = {
  contact_title:      'Контакты компании НАМПАК',
  contact_text:       'Свяжитесь с отделом продаж для консультации по тиражам, оптовым ценам, изготовлению упаковки по индивидуальным размерам и брендированию.',
  contact_phone1:     '+7 (993) 117-64-92',
  contact_phone2:     '+7 (965) 032-61-18',
  contact_address:    'г. Санкт-Петербург, складской комплекс и пункт отгрузки (Пн-Пт: 09:00 - 18:00)',
  contact_inn:        '780534396013',
  contact_ogrnip:     '325784700428266',
  contact_email:      'nampack@yandex.ru',
  contact_legal_name: 'ООО «НАМПАК» / Отдел оптовых поставок',
  social_tg:          'https://t.me/namupak',
  social_max:         'https://max.ru/join/CNMJPGqDX3nDW430jTIt4Ft1HDnfe-j1uSjygxIxgRg',
}

/* ── Иконка Telegram ───────────────────────────────────────────────────────── */
function TelegramIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

/* ── Иконка Max Messenger ─────────────────────────────────────────────────── */
function MaxIcon({ className = 'w-5 h-5' }) {
  return (
    <span className={`inline-flex items-center justify-center font-black rounded text-[11px] font-mono leading-none bg-[#162330] text-white px-1.5 py-1 ${className}`}>
      MAX
    </span>
  )
}

export default function ContactsPage() {
  const [s, setS] = useState(DEFAULTS)
  const [form, setForm] = useState({ name: '', phone: '', company: '', message: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/settings/')
      .then(({ data }) => setS(prev => ({ ...prev, ...data })))
      .catch(() => { /* default */ })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSent(true)
    }, 600)
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Хлебные крошки */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-[#162330] transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Контакты</span>
        </nav>

        {/* Заголовок */}
        <div className="mb-10 max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FAF5EF] text-[#B08455] border border-[#E8D8C5] mb-3">
            Отдел продаж и склад
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#162330] tracking-tight mb-4">
            Контакты «НАМПАК»
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            {s.contact_text || DEFAULTS.contact_text}
          </p>
        </div>

        {/* Сетка контактов */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Колонка 1: Телефоны и мессенджеры */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#162330] flex items-center justify-center mb-5">
                <Phone className="w-6 h-6 text-[#162330]" />
              </div>
              <h2 className="text-lg font-bold text-[#162330] mb-2">Отдел оптовых продаж</h2>
              <p className="text-xs text-slate-500 mb-5">
                Консультации по тиражам, расчёт индивидуальных заказов и выставление счетов
              </p>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Многоканальный</div>
                  <a
                    href={`tel:${s.contact_phone1.replace(/\D/g, '')}`}
                    className="text-xl md:text-2xl font-black text-[#162330] hover:text-[#C59B6D] transition-colors block"
                  >
                    {s.contact_phone1}
                  </a>
                </div>

                {s.contact_phone2 && (
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Дополнительный</div>
                    <a
                      href={`tel:${s.contact_phone2.replace(/\D/g, '')}`}
                      className="text-lg font-bold text-slate-800 hover:text-[#C59B6D] transition-colors block"
                    >
                      {s.contact_phone2}
                    </a>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Электронная почта</div>
                  <a
                    href={`mailto:${s.contact_email}`}
                    className="text-base font-semibold text-slate-700 hover:text-[#C59B6D] transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-slate-400" />
                    {s.contact_email}
                  </a>
                </div>
              </div>
            </div>

            {/* Быстрые мессенджеры */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Быстрая связь в мессенджерах</div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={s.social_tg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white transition-all text-xs font-bold"
                >
                  <TelegramIcon className="w-4 h-4" />
                  <span>Telegram</span>
                </a>
                <a
                  href={s.social_max}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-[#162330] hover:text-white transition-all text-xs font-bold"
                >
                  <MaxIcon />
                  <span>Max</span>
                </a>
              </div>
            </div>
          </div>

          {/* Колонка 2: Склад и график работы */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C59B6D] flex items-center justify-center mb-5">
                <MapPin className="w-6 h-6 text-[#C59B6D]" />
              </div>
              <h2 className="text-lg font-bold text-[#162330] mb-2">Склад и самовывоз</h2>
              <p className="text-xs text-slate-500 mb-5">
                Отгрузка готовых заказов и самовывоз по предварительному согласованию
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Адрес склада</div>
                    <div className="text-sm font-semibold text-slate-800 leading-snug">
                      {s.contact_address}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                  <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Время работы склада</div>
                    <div className="text-sm font-semibold text-slate-800">
                      Понедельник — Пятница: 09:00 – 18:00
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Суббота, Воскресенье: выходной</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Пропускной режим</div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      Для заезда грузового и легкового транспорта требуется предварительное согласование номера авто с менеджером.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                to="/payment"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Подробнее об условиях доставки →
              </Link>
            </div>
          </div>

          {/* Колонка 3: Реквизиты компании */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#162330] flex items-center justify-center mb-5">
                <Building2 className="w-6 h-6 text-[#162330]" />
              </div>
              <h2 className="text-lg font-bold text-[#162330] mb-2">Реквизиты для юрлиц</h2>
              <p className="text-xs text-slate-500 mb-5">
                Работаем по безналичному расчету с НДС и без НДС с оформлением полного пакета документов
              </p>

              <div className="space-y-3 bg-[#F8FAFC] rounded-xl p-4 border border-slate-200/60 font-mono text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase">Наименование:</span>
                  <span className="font-semibold text-slate-800">{s.contact_legal_name || 'ООО «НАМПАК»'}</span>
                </div>
                {s.contact_inn && (
                  <div>
                    <span className="text-slate-400 block text-[11px] uppercase">ИНН / КПП:</span>
                    <span className="font-semibold text-slate-800">{s.contact_inn}</span>
                  </div>
                )}
                {s.contact_ogrnip && (
                  <div>
                    <span className="text-slate-400 block text-[11px] uppercase">ОГРН / ОГРНИП:</span>
                    <span className="font-semibold text-slate-800">{s.contact_ogrnip}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase">Назначение платежа:</span>
                  <span className="text-slate-700">Оплата по счету за упаковочные материалы</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500 flex flex-col gap-2">
              <Link to="/warranty" className="hover:text-[#C59B6D] transition-colors underline underline-offset-2">
                Гарантия качества и стандарты ГОСТ
              </Link>
              <Link to="/privacy" className="hover:text-[#C59B6D] transition-colors underline underline-offset-2">
                Политика обработки персональных данных
              </Link>
            </div>
          </div>
        </div>

        {/* Форма обратной связи для оптовиков */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs max-w-4xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C59B6D]">Быстрый запрос</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#162330] mt-1 mb-3">
              Получить расчет стоимости тиража
            </h2>
            <p className="text-slate-600 text-sm">
              Укажите необходимые размеры коробок или пакетов, желаемый объем партии и нанесение логотипа. Менеджер подготовит индивидуальное коммерческое предложение в течение 30 минут.
            </p>
          </div>

          {sent ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center max-w-lg mx-auto">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-emerald-950 mb-1">Заявка успешно отправлена!</h3>
              <p className="text-xs text-emerald-700 leading-relaxed mb-4">
                Менеджер НАМПАК свяжется с вами по указанному телефону или в мессенджере в ближайшее рабочее время.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-xs font-bold text-[#162330] underline hover:text-[#C59B6D]"
              >
                Отправить ещё один запрос
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Александр"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Телефон для связи *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Организация или ИНН (для юрлиц)
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  placeholder="ООО «Компания» или ИНН"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Что требуется рассчитать?
                </label>
                <textarea
                  rows="3"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Например: Самосборные коробки 260×170×80 Т-23 — 15 000 шт., печать логотипа в 1 цвет. Доставка в Москву."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none text-sm transition-all resize-y"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-[#162330] hover:bg-[#1E2F40] text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    'Отправка...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#C59B6D]" />
                      <span>Отправить заявку менеджеру</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  Нажимая кнопку, вы соглашаетесь с условиями <Link to="/privacy" className="underline hover:text-slate-600">политики конфиденциальности</Link>
                </p>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}
