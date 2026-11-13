import { useState, useEffect, useCallback } from 'react'
import { Save, Check, Settings, Phone, Mail, MapPin, Building2, Shield, Truck, FileText, Info } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { adminApi } from '../../api/axios'

/* ── Значения по умолчанию для НАМПАК ─────────────────────────────────────── */
const DEFAULTS = {
  about_title:            'О компании «НАМПАК»',
  about_text:             'НАМПАК — торгово-производственная компания, специализирующаяся на оптовых и мелкооптовых поставках профессиональных упаковочных материалов: гофрокоробов, самосборных коробок, курьерских пакетов, скотча, пакетов БОПП и Zip-Lock, а также термоэтикеток для маркетплейсов.',
  contact_text:           'Свяжитесь с отделом продаж для консультации по тиражам, оптовым ценам, изготовлению упаковки по индивидуальным размерам и брендированию.',
  contact_phone1:         '+7 (993) 117-64-92',
  contact_phone2:         '+7 (965) 032-61-18',
  contact_address:        'г. Санкт-Петербург, складской комплекс и пункт отгрузки (Пн-Пт: 09:00 - 18:00)',
  contact_inn:            '780534396013',
  contact_ogrnip:         '325784700428266',
  contact_email:          'nampack@yandex.ru',
  contact_legal_name:     'ООО «НАМПАК»',
  social_vk:              '',
  social_tg:              'https://t.me/namupak',
  social_max:             'https://max.ru/join/CNMJPGqDX3nDW430jTIt4Ft1HDnfe-j1uSjygxIxgRg',
  social_yt:              '',
  social_rutube:          '',
  warranty_return_title:  'Возврат и обмен продукции',
  warranty_return_text:   'Мы ценим доверие наших партнёров и несём полную финансовую и юридическую ответственность за соответствие отгруженной партии заявленным характеристикам. При обнаружении брака производим замену или возврат денег в течение 3 рабочих дней.',
  warranty_period_title:  'Стандарты качества',
  warranty_period_text:   'Вся продукция НАМПАК соответствует требованиям ГОСТ 9142-2014 и ГОСТ Р 52901-2007. Каждая партия проходит проверку прочности на сжатие и расслаивание.',
  privacy_title:          'Политика конфиденциальности НАМПАК',
  privacy_text:           '',
  payment_title:          'Оплата и доставка',
  payment_text:           '',
  developer_name:         '',
  developer_url:          '',
}

/* ── Вкладки ───────────────────────────────────────────────────────────────── */
const TABS = [
  { key: 'about',    label: 'О компании'          , Icon: Info      },
  { key: 'contacts', label: 'Контакты и реквизиты', Icon: Building2 },
  { key: 'delivery', label: 'Оплата и доставка'   , Icon: Truck     },
  { key: 'warranty', label: 'Гарантия и возврат'  , Icon: Shield    },
  { key: 'legal',    label: 'Политика'            , Icon: FileText  },
]

/* ── Поле формы ────────────────────────────────────────────────────────────── */
function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        {label}
        {hint && <span className="ml-1 text-slate-400 normal-case tracking-normal font-normal">— {hint}</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = "w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#162330] placeholder:text-slate-400 focus:outline-none focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 transition-all"
const textareaCls = inputCls + " resize-y min-h-[90px]"

export default function AdminSiteSettings() {
  const [form,    setForm]    = useState(DEFAULTS)
  const [tab,     setTab]     = useState('about')
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  const loadSettings = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await adminApi.get('/admin/settings/')
      setForm(prev => ({ ...prev, ...data }))
    } catch {
      /* default */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadSettings() }, [loadSettings])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      await adminApi.patch('/admin/settings/', { settings: form })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(
        Array.isArray(detail)
          ? detail.map(d => d.msg).join('; ')
          : (detail ?? 'Ошибка сохранения настроек')
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="px-4 py-16 text-center text-slate-400">Загрузка настроек...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="px-4 py-6 max-w-4xl mx-auto">
        
        {/* Заголовок страницы */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#162330] tracking-tight">Настройки сайта НАМПАК</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Редактирование контактной информации, реквизитов компании, мессенджеров и правовых разделов
          </p>
        </div>

        {/* Переключатель вкладок */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                tab === key
                  ? 'bg-[#162330] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon size={14} className={tab === key ? 'text-[#C59B6D]' : 'text-slate-400'} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ── ВКЛАДКА: О компании ───────────────────────────── */}
        {tab === 'about' && (
          <div className="space-y-5 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <Field label="Заголовок блока «О компании»">
              <input
                className={inputCls}
                value={form.about_title}
                onChange={set('about_title')}
                placeholder="О компании «НАМПАК»"
              />
            </Field>
            <Field label="Текст описания компании">
              <textarea
                className={textareaCls}
                rows={6}
                value={form.about_text}
                onChange={set('about_text')}
                placeholder="Расскажите о производстве, складе и возможностях НАМПАК..."
              />
            </Field>
          </div>
        )}

        {/* ── ВКЛАДКА: Контакты и реквизиты ─────────────────── */}
        {tab === 'contacts' && (
          <div className="space-y-6 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <Field label="Вводный текст на странице контактов">
              <textarea
                className={textareaCls}
                rows={3}
                value={form.contact_text}
                onChange={set('contact_text')}
                placeholder="Свяжитесь с отделом продаж для консультации..."
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Телефон 1 (основной)" hint="для шапки и кликов tel:">
                <input className={inputCls} value={form.contact_phone1} onChange={set('contact_phone1')} placeholder="+7 (993) 117-64-92" />
              </Field>
              <Field label="Телефон 2 (дополнительный)" hint="необязательно">
                <input className={inputCls} value={form.contact_phone2} onChange={set('contact_phone2')} placeholder="+7 (965) 032-61-18" />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Контактный E-mail" hint="для заявок клиентов">
                <input className={inputCls} type="email" value={form.contact_email} onChange={set('contact_email')} placeholder="nampack@yandex.ru" />
              </Field>
              <Field label="Адрес склада / самовывоза">
                <input className={inputCls} value={form.contact_address} onChange={set('contact_address')} placeholder="г. Санкт-Петербург, склад..." />
              </Field>
            </div>

            {/* Мессенджеры */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Мессенджеры для быстрой связи
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Telegram канал / чат" hint="https://t.me/...">
                  <input className={inputCls} value={form.social_tg} onChange={set('social_tg')} placeholder="https://t.me/namupak" />
                </Field>
                <Field label="Max мессенджер" hint="https://max.ru/join/...">
                  <input className={inputCls} value={form.social_max} onChange={set('social_max')} placeholder="https://max.ru/join/..." />
                </Field>
              </div>
            </div>

            {/* Реквизиты */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Юридические реквизиты
              </div>
              <Field label="Полное юридическое наименование" hint="ООО или ИП">
                <input className={inputCls} value={form.contact_legal_name} onChange={set('contact_legal_name')} placeholder="ООО «НАМПАК»" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="ИНН">
                  <input className={inputCls} value={form.contact_inn} onChange={set('contact_inn')} placeholder="780534396013" />
                </Field>
                <Field label="ОГРН / ОГРНИП">
                  <input className={inputCls} value={form.contact_ogrnip} onChange={set('contact_ogrnip')} placeholder="325784700428266" />
                </Field>
              </div>
            </div>
          </div>
        )}

        {/* ── ВКЛАДКА: Оплата и доставка ────────────────────── */}
        {tab === 'delivery' && (
          <div className="space-y-5 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <Field label="Заголовок страницы оплаты и доставки">
              <input
                className={inputCls}
                value={form.payment_title}
                onChange={set('payment_title')}
                placeholder="Оплата и доставка"
              />
            </Field>
            <Field label="Дополнительный текст / особые условия" hint="отображается внизу страницы">
              <textarea
                className={textareaCls}
                rows={6}
                value={form.payment_text}
                onChange={set('payment_text')}
                placeholder="Дополнительные условия отгрузки, работы с транспортными компаниями..."
              />
            </Field>
          </div>
        )}

        {/* ── ВКЛАДКА: Гарантия и возврат ───────────────────── */}
        {tab === 'warranty' && (
          <div className="space-y-5 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <Field label="Заголовок блока возврата">
              <input
                className={inputCls}
                value={form.warranty_return_title}
                onChange={set('warranty_return_title')}
                placeholder="Возврат и обмен продукции"
              />
            </Field>
            <Field label="Текст условий возврата">
              <textarea
                className={textareaCls}
                rows={4}
                value={form.warranty_return_text}
                onChange={set('warranty_return_text')}
                placeholder="Условия возврата бракованной партии или складских позиций..."
              />
            </Field>
            <Field label="Заголовок блока стандартов качества">
              <input
                className={inputCls}
                value={form.warranty_period_title}
                onChange={set('warranty_period_title')}
                placeholder="Стандарты качества"
              />
            </Field>
            <Field label="Текст о ГОСТ и контроле качества">
              <textarea
                className={textareaCls}
                rows={4}
                value={form.warranty_period_text}
                onChange={set('warranty_period_text')}
                placeholder="Соответствие ГОСТ 9142-2014, испытания картона..."
              />
            </Field>
          </div>
        )}

        {/* ── ВКЛАДКА: Политика ─────────────────────────────── */}
        {tab === 'legal' && (
          <div className="space-y-5 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <Field label="Заголовок страницы политики">
              <input
                className={inputCls}
                value={form.privacy_title}
                onChange={set('privacy_title')}
                placeholder="Политика конфиденциальности НАМПАК"
              />
            </Field>
            <Field label="Дополнительные условия / примечания к политике">
              <textarea
                className={textareaCls}
                rows={6}
                value={form.privacy_text}
                onChange={set('privacy_text')}
                placeholder="Специальные положения политики при необходимости..."
              />
            </Field>
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <p className="mt-4 text-rose-600 text-xs bg-rose-50 rounded-xl p-3 border border-rose-100">{error}</p>
        )}

        {/* Sticky кнопка сохранить */}
        <div className="sticky bottom-16 md:bottom-4 mt-6 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl
                        text-sm font-bold transition-all shadow-md
                        ${saved
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#162330] hover:bg-[#1E2F40] text-white disabled:opacity-60'}`}
          >
            {saving
              ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              : saved
                ? <Check size={20} className="text-white" />
                : <Save size={20} className="text-[#C59B6D]" />}
            <span>{saving ? 'Сохранение...' : saved ? 'Настройки успешно сохранены!' : 'Сохранить все настройки'}</span>
          </button>
        </div>

      </div>
    </AdminLayout>
  )
}
