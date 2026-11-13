import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#162330] via-[#1E2F40] to-[#0F172A] text-white py-16 md:py-24 overflow-hidden border-b border-slate-200">

      {/* Фоновые декоративные элементы (сетка и мягкое свечение) */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C59B6D_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#C59B6D]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">

          {/* Верхний бейдж */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-xs text-xs font-heading font-semibold text-[#E8D8C5] mb-6">
            <span>📦</span>
            <span>Производство и оптовый склад упаковки • Доставка по всей РФ</span>
          </div>

          {/* Главный заголовок */}
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white leading-[1.15] tracking-tight mb-5">
            Профессиональная упаковка <br className="hidden sm:inline" />
            для вашего бизнеса от{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C59B6D] via-[#DFB98A] to-[#C59B6D]">
              НАМПАК
            </span>
          </h1>

          {/* Подзаголовок */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl font-body">
            Гофрокороба всех марок, курьерские пакеты с усиленным клапаном, скотч, Zip-Lock и БОПП пакеты, термоэтикетки. Собственное производство, оптовые цены и брендирование от 2 000 шт.
          </p>

          {/* CTA кнопки */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#catalog-section"
              className="px-7 py-3.5 bg-gradient-to-r from-[#C59B6D] to-[#B08455] hover:from-[#B08455] hover:to-[#9A7244]
                         text-white font-heading font-bold text-sm tracking-wide rounded-xl shadow-lg transition-all active:scale-98"
            >
              Перейти в каталог продукции ↓
            </a>

          </div>

        </div>
      </div>

    </section>
  )
}
