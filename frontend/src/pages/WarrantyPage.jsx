import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, RefreshCw, Award, CheckCircle2, Box, HelpCircle, ArrowRight } from 'lucide-react'
import { api } from '../api/axios'

export default function WarrantyPage() {
  const [settings, setSettings] = useState({})

  useEffect(() => {
    api.get('/settings/')
      .then(({ data }) => setSettings(data))
      .catch(() => {})
  }, [])

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Хлебные крошки */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-[#162330] transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Гарантия качества</span>
        </nav>

        {/* Заголовок */}
        <div className="mb-12 max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FAF5EF] text-[#B08455] border border-[#E8D8C5] mb-3">
            Стандарты производства
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#162330] tracking-tight mb-4">
            Гарантия качества и стандарты НАМПАК
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Вся продукция «НАМПАК» изготавливается из первичного и вторичного сырья высшей категории со строгим соблюдением требований ГОСТ и санитарно-эпидемиологических норм РФ.
          </p>
        </div>

        {/* Стандарты качества карточки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C59B6D] flex items-center justify-center mb-5">
              <Award className="w-6 h-6 text-[#C59B6D]" />
            </div>
            <h2 className="text-lg font-bold text-[#162330] mb-2">Соответствие ГОСТ</h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Гофрокороба производятся по ГОСТ 9142-2014 и ГОСТ Р 52901-2007. Каждая партия проходит проверку на сопротивление торцевому сжатию (ECT) и продавливанию (Bursting Strength).
            </p>
            <div className="text-xs font-semibold text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              Марки сырья: Т-21, Т-22, Т-23, Т-24
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#162330] flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6 text-[#162330]" />
            </div>
            <h2 className="text-lg font-bold text-[#162330] mb-2">Надёжность полимеров</h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Курьер-пакеты оснащаются усиленной деструктивной клеевой лентой горячего расплава — при попытке вскрытия пакет необратимо деформируется, гарантируя сохранность вложений.
            </p>
            <div className="text-xs font-semibold text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              Трёхслойный светонепроницаемый ПВД
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <Box className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-[#162330] mb-2">Точность геометрии</h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Лазерная высечка и точная биговка гарантируют идеальную сборку самосборных коробок без перекосов и заломов, а также плотное прилегание клапанов четырёхклапанных ящиков.
            </p>
            <div className="text-xs font-semibold text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              Погрешность высечки не более 1 мм
            </div>
          </div>

        </div>

        {/* Раздел возврата и обмена */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs mb-14">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C59B6D]">
              {settings.warranty_return_title || 'Возврат и обмен продукции'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#162330] mt-1 mb-3">
              Условия возврата и гарантийные обязательства
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {settings.warranty_return_text || (
                'Мы ценим доверие наших партнёров и несём полную финансовую и юридическую ответственность за соответствие отгруженной партии заявленным характеристикам.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#162330] text-sm mb-1">При обнаружении брака</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Если в полученной партии обнаружен заводской дефект (брак высечки, расклейка шва, несоответствие толщины), мы производим бесплатную замену или возврат денег в течение 3 рабочих дней.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#162330] text-sm mb-1">Возврат складских позиций</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Стандартные складские короба, скотч и пакеты можно вернуть или обменять в течение 14 дней с момента поставки при сохранении товарного вида и целостности заводских упаковок.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#162330] text-sm mb-1">Индивидуальные тиражи с брендированием</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Изделия, изготовленные по специальным размерам клиента или с нанесением индивидуального логотипа по согласованному макету, подлежат возврату только в случае выявления производственного брака.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#162330] text-sm mb-1">Составление рекламации</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Для оформления рекламации достаточно направить фото или видео дефекта вашему персональному менеджеру НАМПАК или на почту nampack@yandex.ru с номером заказа.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Правила хранения гофрокартона */}
        <div className="bg-[#162330] text-white rounded-3xl p-8 sm:p-10 mb-12 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-6 h-6 text-[#C59B6D]" />
            <h3 className="text-xl font-bold text-white">Рекомендации по хранению гофротары</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-6 max-w-3xl">
            Гофрокартон — экологичный гигроскопичный материал, прочность которого напрямую зависит от условий окружающей среды на складе.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="font-bold text-[#C59B6D] block mb-1">Температура</span>
              <span>Хранить в закрытых сухих помещениях при температуре от +5°C до +30°C.</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="font-bold text-[#C59B6D] block mb-1">Влажность воздуха</span>
              <span>Оптимальная относительная влажность 45–65%. Избегать прямого контакта с водой и сыростью.</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="font-bold text-[#C59B6D] block mb-1">Штабелирование</span>
              <span>Хранить на деревянных поддонах на высоте не менее 10 см от пола в горизонтальном положении.</span>
            </div>
          </div>
        </div>

        {/* Навигация */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200">
          <div>
            <div className="font-bold text-slate-900 text-base">Нужна консультация технолога?</div>
            <div className="text-xs text-slate-500">Поможем подобрать марку картона под вес и габариты вашей продукции</div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/contacts"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#162330] hover:bg-[#1E2F40] text-white font-bold text-xs tracking-wide shadow-xs transition-colors"
            >
              <span>Связаться с отделом контроля качества</span>
              <ArrowRight className="w-4 h-4 text-[#C59B6D]" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
