import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/axios'

const DEFAULT_TITLE = 'О компании НАМПАК'
const DEFAULT_TEXT =
  'НАМПАК — специализированный поставщик и производитель упаковочных материалов для электронной коммерции, производств, логистических центров и торговых сетей.\n\n' +
  'В нашем каталоге представлены тысячи складских позиций: гофрокороба всех популярных марок (Т-21, Т-22, Т-23, Т-24), прочные курьер-пакеты с клеевым клапаном, прозрачный и брендированный скотч, БОПП и Zip-Lock пакеты с бегунком, а также термоэтикетки для термопринтеров.\n\n' +
  'Мы предлагаем гибкие условия: отгрузку в розницу от 1 шт./упаковки и крупные оптовые партии с прогрессивными скидками. Изготавливаем коробки по индивидуальным размерам заказчика и выполняем флексопечать фирменной символики.'

export default function AboutPage() {
  const [title, setTitle] = useState(DEFAULT_TITLE)
  const [text,  setText]  = useState(DEFAULT_TEXT)

  useEffect(() => {
    api.get('/settings/')
      .then(({ data }) => {
        if (data.about_title) setTitle(data.about_title)
        if (data.about_text)  setText(data.about_text)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="bg-[#F8FAFC] py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-[#C59B6D]">Главная</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">О компании</span>
        </div>

        {/* ── Заголовок и история ───────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C59B6D] mb-2 block">
            Производство и оптовый склад
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#162330] leading-tight mb-6">
            {title}
          </h1>
          <div className="w-16 h-1 bg-[#C59B6D] rounded-full mb-8" />
          <p className="text-slate-600 font-body text-base md:text-lg leading-relaxed whitespace-pre-line">
            {text}
          </p>
        </div>

        {/* ── 4 ключевых преимущества ──────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
            <span className="text-3xl">📦</span>
            <h3 className="font-heading font-bold text-base text-[#162330]">
              Склад в СПб
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Постоянный запас сотен типоразмеров коробок, пакетов и скотча в наличии.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
            <span className="text-3xl">🎨</span>
            <h3 className="font-heading font-bold text-base text-[#162330]">
              Печать логотипа
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Флексопечать и шелкография на коробках, пакетах и скотче от 2 000 шт.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
            <span className="text-3xl">📄</span>
            <h3 className="font-heading font-bold text-base text-[#162330]">
              Работа по безналу
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Выставление счетов для ООО и ИП, предоставление УПД, работа с НДС и без.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
            <span className="text-3xl">🚚</span>
            <h3 className="font-heading font-bold text-base text-[#162330]">
              Доставка по всей РФ
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Отправка через Деловые Линии, ПЭК, СДЭК или попутным автотранспортом.
            </p>
          </div>
        </div>

        {/* ── CTA блок ─────────────────────────────────────────── */}
        <div className="bg-[#162330] rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl">
              Готовы рассчитать партию упаковки?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Отправьте заявку через каталог или свяжитесь с нашим отделом продаж.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="px-6 py-3 bg-[#C59B6D] hover:bg-[#B08455] text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              Перейти в каталог →
            </Link>
            <Link
              to="/contacts"
              className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-heading font-semibold text-xs tracking-wider transition-colors border border-white/20"
            >
              Контакты
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
