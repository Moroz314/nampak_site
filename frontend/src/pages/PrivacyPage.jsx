import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Lock, Eye, FileText, ArrowRight } from 'lucide-react'
import { api } from '../api/axios'

export default function PrivacyPage() {
  const [settings, setSettings] = useState({})

  useEffect(() => {
    api.get('/settings/')
      .then(({ data }) => setSettings(data))
      .catch(() => {})
  }, [])

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Хлебные крошки */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-[#162330] transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Политика конфиденциальности</span>
        </nav>

        {/* Заголовок */}
        <div className="mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FAF5EF] text-[#B08455] border border-[#E8D8C5] mb-3">
            152-ФЗ «О персональных данных»
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#162330] tracking-tight mb-4">
            {settings.privacy_title || 'Политика конфиденциальности НАМПАК'}
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Настоящая Политика определяет порядок обработки и защиты персональной информации пользователей сайта nampack (ООО «НАМПАК»), собираемой в целях взаимодействия с контрагентами и выполнения заказов.
          </p>
        </div>

        {/* Контент политики */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8 text-slate-700 text-sm leading-relaxed">
          
          <section>
            <h2 className="text-lg font-bold text-[#162330] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C59B6D]" />
              1. Общие положения
            </h2>
            <p>
              1.1. Оператором обработки персональных данных является ООО «НАМПАК». По всем вопросам, связанным с обработкой персональных данных, вы можете обращаться по электронной почте <a href="mailto:nampack@yandex.ru" className="text-[#C59B6D] font-semibold underline">nampack@yandex.ru</a> или по контактным телефонам, указанным на сайте.
            </p>
            <p className="mt-2">
              1.2. Оставляя заявку на сайте или оформляя заказ, пользователь подтверждает свое согласие с условиями настоящей Политики и дает согласие на обработку своих персональных данных в соответствии с Федеральным законом РФ № 152-ФЗ.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#162330] mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#C59B6D]" />
              2. Какие данные мы собираем
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>ФИО контактного лица;</li>
              <li>Номер контактного телефона для оперативной связи;</li>
              <li>Адрес электронной почты (для отправки счетов, спецификаций и договоров);</li>
              <li>Реквизиты организации / ИП (наименование, ИНН, КПП, юридический адрес) при оформлении B2B-заказа;</li>
              <li>Адрес доставки или предпочтительный терминал транспортной компании;</li>
              <li>Технические файлы cookie и аналитические обезличенные метрики для обеспечения корректной работы каталога и корзины.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#162330] mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C59B6D]" />
              3. Цели сбора информации
            </h2>
            <p>
              Персональные данные используются исключительно для:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 mt-2">
              <li>Обработки входящих заявок, расчёта стоимости тиражей и связи с клиентом;</li>
              <li>Заключения договоров поставки и выставления счетов на безналичную оплату;</li>
              <li>Организации доставки продукции через транспортные компании или согласования самовывоза;</li>
              <li>Предоставления закрывающих бухгалтерских документов (УПД, акты, накладные);</li>
              <li>Информирования о статусе производства и отгрузки заказа.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#162330] mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#C59B6D]" />
              4. Защита и передача третьим лицам
            </h2>
            <p>
              4.1. Мы гарантируем конфиденциальность переданных данных и не продаём, не передаём и не раскрываем персональные данные третьим лицам в маркетинговых целях.
            </p>
            <p className="mt-2">
              4.2. Передача данных третьим лицам допускается исключительно для исполнения обязательств по поставке: транспортным компаниям (ФИО получателя, контактный телефон, адрес доставки) и сервисам электронного документооборота (Диадок / СБИС) для отправки УПД.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#162330] mb-3">
              5. Изменение и отзыв согласия
            </h2>
            <p>
              Пользователь имеет право в любой момент отозвать свое согласие на обработку персональных данных, направив соответствующее заявление на электронный адрес <a href="mailto:nampack@yandex.ru" className="text-[#C59B6D] font-semibold underline">nampack@yandex.ru</a>.
            </p>
          </section>

          {settings.privacy_text && (
            <section className="pt-6 border-t border-slate-100">
              <h2 className="text-base font-bold text-[#162330] mb-2">Особые примечания</h2>
              <p className="whitespace-pre-line text-slate-600 text-xs">{settings.privacy_text}</p>
            </section>
          )}

        </div>

        {/* Навигация */}
        <div className="mt-8 flex items-center justify-between">
          <Link to="/" className="text-xs font-bold text-[#162330] hover:text-[#C59B6D] flex items-center gap-1.5 transition-colors">
            <span>← Вернуться в каталог</span>
          </Link>
          <Link to="/contacts" className="text-xs font-bold text-slate-500 hover:text-[#162330] transition-colors">
            Контакты компании →
          </Link>
        </div>

      </div>
    </div>
  )
}
