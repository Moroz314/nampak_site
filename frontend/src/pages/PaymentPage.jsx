import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, Truck, FileText, CheckCircle2, Building2, Package, MapPin, ArrowRight } from 'lucide-react'
import { api } from '../api/axios'

export default function PaymentPage() {
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
          <span className="text-slate-900 font-semibold">Оплата и доставка</span>
        </nav>

        {/* Заголовок */}
        <div className="mb-12 max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FAF5EF] text-[#B08455] border border-[#E8D8C5] mb-3">
            Условия сотрудничества
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#162330] tracking-tight mb-4">
            {settings.payment_title || 'Оплата и доставка'}
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Мы работаем с юридическими и физическими лицами по всей России. Прозрачные условия, работа по договору, предоставление полного комплекта закрывающих документов и оперативная логистика.
          </p>
        </div>

        {/* Сетка основных разделов: Оплата и Доставка */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          
          {/* Блок ОПЛАТА */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#C59B6D] flex items-center justify-center mb-6">
                <CreditCard className="w-7 h-7 text-[#C59B6D]" />
              </div>
              <h2 className="text-2xl font-bold text-[#162330] mb-3">Способы оплаты</h2>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Все заказы оформляются через менеджера НАМПАК. После согласования партии, наличия на складе и адреса доставки вам выставляется счёт.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70">
                  <div className="flex items-center gap-2 mb-1.5 font-bold text-sm text-[#162330]">
                    <Building2 className="w-4 h-4 text-[#C59B6D]" />
                    <span>Безналичный расчёт для юрлиц и ИП</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Оплата по счёту. Поддерживаем ЭДО (Диадок, СБИС) для мгновенного документооборота.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70">
                  <div className="flex items-center gap-2 mb-1.5 font-bold text-sm text-[#162330]">
                    <FileText className="w-4 h-4 text-[#162330]" />
                    <span>Индивидуальные условия</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Для постоянных оптовых покупателей действуют индивидуальные условия сотрудничества (ИУС).
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end text-xs text-slate-500">
              <span className="font-semibold text-[#162330]">Без скрытых комиссий</span>
            </div>
          </div>

          {/* Блок ДОСТАВКА */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#162330] flex items-center justify-center mb-6">
                <Truck className="w-7 h-7 text-[#162330]" />
              </div>
              <h2 className="text-2xl font-bold text-[#162330] mb-3">Варианты доставки</h2>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Отгружаем заказы со склада в г. Санкт-Петербург. Подбираем оптимальный и экономичный маршрут доставки в зависимости от объёма и веса груза.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70">
                  <div className="flex items-center gap-2 mb-1.5 font-bold text-sm text-[#162330]">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Бесплатный самовывоз со склада</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    г. Санкт-Петербург, адрес склада: г. Петергоф, Ропшинское шоссе, 8Г. Пн–Пт с 09:00 до 18:00. Бесплатная погрузка паллет и коробок в ваш транспорт (легковой, газель, фура).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70">
                  <div className="flex items-center gap-2 mb-1.5 font-bold text-sm text-[#162330]">
                    <Truck className="w-4 h-4 text-[#C59B6D]" />
                    <span>Доставка транспортными компаниями по РФ</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    г. Санкт-Петербург. Отправляем заказы по всей территории России: Деловые Линии, ПЭК, СДЭК, Возовоз, Байкал Сервис, КИТ и др. Отгрузка и доставка день в день не осуществляется.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Расчёт доставки менеджером</span>
              <span className="font-semibold text-emerald-600">Надёжная упаковка на паллетах</span>
            </div>
          </div>

        </div>

        {/* Если в настройках сайта администратор сохранил свой кастомный текст — покажем его */}
        {settings.payment_text && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs mb-14">
            <h3 className="text-lg font-bold text-[#162330] mb-3">Дополнительные условия и примечания</h3>
            <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">
              {settings.payment_text}
            </p>
          </div>
        )}

        {/* 4 шага оформления заказа */}
        <div className="bg-[#162330] text-white rounded-3xl p-8 sm:p-12 shadow-md mb-12">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C59B6D]">Простой процесс</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Как происходит заказ в «НАМПАК»
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <span className="text-2xl font-black text-[#C59B6D] mb-2 block">01</span>
              <h3 className="font-bold text-white text-base mb-1.5">Заявка на сайте</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Добавьте нужные коробки или пакеты в корзину и отправьте контактные данные без онлайн-оплаты.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <span className="text-2xl font-black text-[#C59B6D] mb-2 block">02</span>
              <h3 className="font-bold text-white text-base mb-1.5">Звонок менеджера</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                В течение 15–30 минут менеджер уточнит объём, рассчитает доставку и сформирует счёт на оплату.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <span className="text-2xl font-black text-[#C59B6D] mb-2 block">03</span>
              <h3 className="font-bold text-white text-base mb-1.5">Оплата счёта</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Оплата безналичным расчётом по счёту. Резервируем товар на складе.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <span className="text-2xl font-black text-[#C59B6D] mb-2 block">04</span>
              <h3 className="font-bold text-white text-base mb-1.5">Отгрузка и доставка</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Комплектуем партию, упаковываем на паллеты и отгружаем со склада или передаём в ТК с трек-номером.
              </p>
            </div>
          </div>
        </div>

        {/* CTA кнопки */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200">
          <div>
            <div className="font-bold text-slate-900 text-base">Готовы выбрать упаковку для вашего бизнеса?</div>
            <div className="text-xs text-slate-500">В каталоге более 24 типоразмеров коробок, скотча и пакетов в наличии</div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#162330] hover:bg-[#1E2F40] text-white font-bold text-xs tracking-wide shadow-xs transition-colors"
            >
              <span>Перейти в каталог</span>
              <ArrowRight className="w-4 h-4 text-[#C59B6D]" />
            </Link>
            <Link
              to="/contacts"
              className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
            >
              Связаться с менеджером
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
