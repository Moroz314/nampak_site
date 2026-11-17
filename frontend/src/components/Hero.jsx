import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-100 border-b border-slate-200 py-10 sm:py-16 md:py-20 flex items-center min-h-[380px] sm:min-h-[460px]">

      {/* Фоновое 3D-изображение упаковки */}
      <div
        className="absolute inset-0 bg-cover bg-center sm:bg-right scale-105 filter blur-[1px] opacity-90 transition-transform duration-700 pointer-events-none"
        style={{ backgroundImage: "url('/hero-packaging.jpg')" }}
      />

      {/* Полупрозрачная подложка для идеальной контрастности текста */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/40 sm:to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent pointer-events-none sm:hidden" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl bg-white/75 backdrop-blur-md p-6 sm:p-9 rounded-2xl sm:rounded-3xl border border-white/80 shadow-lg">

          {/* Верхний бейдж */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-[#162330]/5 border border-[#162330]/10 text-[11px] sm:text-xs font-heading font-semibold text-[#8C5D30] mb-3 sm:mb-4">
            <span>📦</span>
            <span className="truncate">Производство и склад в СПб • Доставка по всей РФ</span>
          </div>

          {/* Главный заголовок */}
          <h1 className="font-heading font-black text-2xl sm:text-4xl md:text-5xl text-[#162330] leading-[1.18] tracking-tight mb-3 sm:mb-4">
            УПАКОВОЧНЫЕ МАТЕРИАЛЫ <br className="hidden sm:inline" />
            для вашего бизнеса от{' '}
            <span className="text-[#C59B6D]">НАМПАК</span>
          </h1>

          {/* Подзаголовок */}
          <p className="text-xs sm:text-base text-slate-700 leading-relaxed mb-6 font-medium">
            Гофрокороба всех марок, курьерские пакеты с усиленным клапаном, скотч, Zip-Lock и БОПП пакеты. Собственное производство, оптовые цены и брендирование.
          </p>

          {/* CTA кнопки */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              to="/catalog"
              className="w-full sm:w-auto text-center px-6 sm:px-7 py-3.5 bg-gradient-to-r from-[#C59B6D] to-[#B08455] hover:from-[#B08455] hover:to-[#9A7244]
                         text-white font-heading font-bold text-xs sm:text-sm tracking-wide rounded-xl shadow-md transition-all active:scale-98"
            >
              Перейти в каталог продукции →
            </Link>
          </div>

        </div>
      </div>

    </section>
  )
}
