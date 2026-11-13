/**
 * Локальный Mock API НАМПАК для Vite Dev Server
 * Предоставляет полноценные данные каталога (8 категорий, 24 товара, настройки, корзину, чекаут,
 * админ-панель: товары, заказы, статьи, галерею, загрузку файлов).
 */

export const CATEGORIES = [
  { id: 1, name: "Самосборные короба", slug: "samosbornye-koroba", sort_order: 1 },
  { id: 2, name: "Четырёхклапанные гофрокороба", slug: "chetyrehklapannye-gofrokoroba", sort_order: 2 },
  { id: 3, name: "Коробки для пиццы", slug: "korobki-dlya-piccy", sort_order: 3 },
  { id: 4, name: "Упаковочный скотч", slug: "upakovochnyj-skotch", sort_order: 4 },
  { id: 5, name: "Курьер-пакеты", slug: "kurer-pakety", sort_order: 5 },
  { id: 6, name: "Пакеты БОПП", slug: "pakety-bopp", sort_order: 6 },
  { id: 7, name: "Пакеты Zip-Lock с бегунком", slug: "pakety-zip-lock-s-begunkom", sort_order: 7 },
  { id: 8, name: "Термоэтикетки", slug: "termoetiketki", sort_order: 8 },
]

export const PRODUCTS = [
  // ── 1. Самосборные короба ──
  {
    id: 1,
    category_id: 1,
    name: "Короб самосборный 220×165×100 Т-23 ТИП Д",
    slug: "korob-samosbornyj-220-165-100-t-23-tip-d",
    price: 10.50,
    min_order_qty: 13500,
    dimensions_mm: "220×165×100 мм",
    material_specs: "Т-23 ТИП Д",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Самосборный короб типа «самолёт» из бурого трёхслойного гофрокартона марки <strong>Т-23 ТИП Д</strong>. Оптимален для фасовки товаров на маркетплейсах (Wildberries, Ozon, Яндекс Маркет), почтовых и курьерских отправлений. Быстро и легко собирается по линиям биговки без скотча.</p>",
  },
  {
    id: 2,
    category_id: 1,
    name: "Короб самосборный 260×170×80 Т-23 ТИП Ж",
    slug: "korob-samosbornyj-260-170-80-t-23-tip-zh",
    price: 11.10,
    min_order_qty: 13000,
    dimensions_mm: "260×170×80 мм",
    material_specs: "Т-23 ТИП Ж",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Самосборный короб 260×170×80 мм из бурого картона марки <strong>Т-23 ТИП Ж</strong>. Усиленные боковые стенки надёжно защищают товары от деформации при доставке.</p>",
  },
  {
    id: 3,
    category_id: 1,
    name: "Короб самосборный 265×165×50 Т-23 ТИП Е",
    slug: "korob-samosbornyj-265-165-50-t-23-tip-e",
    price: 9.70,
    min_order_qty: 15000,
    dimensions_mm: "265×165×50 мм",
    material_specs: "Т-23 ТИП Е",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Компактный плоский самосборный короб высотой 50 мм из микрогофрокартона <strong>Т-23 профиль Е</strong>. Отлично подходит для аксессуаров, текстиля, плоских гаджетов и полиграфии.</p>",
  },
  {
    id: 4,
    category_id: 1,
    name: "Короб самосборный 265×165×50 Т-22 ТИП Е",
    slug: "korob-samosbornyj-265-165-50-t-22-tip-e",
    price: 9.30,
    min_order_qty: 15000,
    dimensions_mm: "265×165×50 мм",
    material_specs: "Т-22 ТИП Е",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Экономичный самосборный короб из микрогофрокартона марки <strong>Т-22 ТИП Е</strong>. Выгодное бюджетное решение для массовых тиражей упаковки легкой продукции.</p>",
  },
  {
    id: 5,
    category_id: 1,
    name: "Короб самосборный 265×165×190 Т-23 ТИП Г",
    slug: "korob-samosbornyj-265-165-190-t-23-tip-g",
    price: 16.70,
    min_order_qty: 9000,
    dimensions_mm: "265×165×190 мм",
    material_specs: "Т-23 ТИП Г",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Вместительный самосборный короб с высотой 190 мм. Прочный трёхслойный гофрокартон <strong>Т-23 ТИП Г</strong> выдерживает штабелирование и защищает объёмные изделия.</p>",
  },
  {
    id: 6,
    category_id: 1,
    name: "Короб 285×95×95 Т-22 Белый (Е)",
    slug: "korob-285-95-95-t-22-belyj-e",
    price: 14.90,
    min_order_qty: 15000,
    dimensions_mm: "285×95×95 мм",
    material_specs: "Т-22 Белый (Е) трёхслойный",
    in_stock: true,
    is_custom_design: true,
    image_url: null,
    images: [],
    description: "<p>Эстетичный белый короб вытянутой формы из микрогофрокартона <strong>Т-22 профиль Е</strong>. Подходит для бутылок, тубусов, свечей и сувенирной продукции. <em>Возможна флексопечать логотипа.</em></p>",
  },
  {
    id: 7,
    category_id: 1,
    name: "Короб 150×130×45 Т-22 Белый",
    slug: "korob-150-130-45-t-22-belyj",
    price: 10.20,
    min_order_qty: 15000,
    dimensions_mm: "150×130×45 мм",
    material_specs: "Т-22 Белый",
    in_stock: true,
    is_custom_design: true,
    image_url: null,
    images: [],
    description: "<p>Маленький презентационный короб из белого картона <strong>Т-22</strong>. Эстетичная упаковка для ювелирных изделий, бижутерии, косметики и подарков. <em>Возможна печать логотипа.</em></p>",
  },
  {
    id: 8,
    category_id: 1,
    name: "Короб 161×119×37 Т-22 Белый",
    slug: "korob-161-119-37-t-22-belyj",
    price: 15.50,
    min_order_qty: 5000,
    dimensions_mm: "161×119×37 мм",
    material_specs: "Т-22 Белый",
    in_stock: true,
    is_custom_design: true,
    image_url: null,
    images: [],
    description: "<p>Компактный белый короб с удобной откидной крышкой. Премиальное качество высечки и биговки. <em>Возможно брендирование от 2000 шт.</em></p>",
  },

  // ── 2. Четырёхклапанные гофрокороба ──
  {
    id: 9,
    category_id: 2,
    name: "Гофрокороб 600×400×400 Т-23",
    slug: "gofrokorob-600-400-400-t-23",
    price: 89.90,
    min_order_qty: 2000,
    dimensions_mm: "600×400×400 мм",
    material_specs: "Т-23 бурый",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Стандартный логистический гофрокороб №1 объемом 96 литров из картона <strong>Т-23 бурый</strong>. Основной стандарт поставок монопаллет и микс-коробов на склады Wildberries и Ozon, а также для переездов и хранения.</p>",
  },
  {
    id: 10,
    category_id: 2,
    name: "Гофрокороб 200×190×130 Т-23",
    slug: "gofrokorob-200-190-130-t-23",
    price: 12.90,
    min_order_qty: 11000,
    dimensions_mm: "200×190×130 мм",
    material_specs: "Т-23 бурый",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Компактный четырёхклапанный ящик из бурого картона <strong>Т-23</strong>. Применяется для отправки автозапчастей, фурнитуры, крепежа и штучных заказов.</p>",
  },
  {
    id: 11,
    category_id: 2,
    name: "Гофрокороб 250×250×250 Т-23",
    slug: "gofrokorob-250-250-250-t-23",
    price: 27.10,
    min_order_qty: 5600,
    dimensions_mm: "250×250×250 мм",
    material_specs: "Т-23 бурый",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Кубический четырёхклапанный ящик 25×25×25 см из картона <strong>Т-23 бурый</strong>. Оптимален для фасовки посуды, сухих смесей, банок и круглой тары.</p>",
  },
  {
    id: 12,
    category_id: 2,
    name: "Гофрокороб 380×253×237 Т-23",
    slug: "gofrokorob-380-253-237-t-23",
    price: 35.40,
    min_order_qty: 4600,
    dimensions_mm: "380×253×237 мм",
    material_specs: "Т-23 бурый",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Паллетный ящик из картона <strong>Т-23 бурый</strong>. Размеры кратны габаритам европаллеты (1200×800 мм), что обеспечивает устойчивую штабелевку без провисаний.</p>",
  },
  {
    id: 13,
    category_id: 2,
    name: "Гофрокороб 310×260×380 Т-23",
    slug: "gofrokorob-310-260-380-t-23",
    price: 41.90,
    min_order_qty: 3900,
    dimensions_mm: "310×260×380 мм",
    material_specs: "Т-23 бурый",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Высокий вертикальный гофрокороб из картона <strong>Т-23 бурый</strong>. Разработан для бутылочной продукции, книг, папок и высокой фасовки.</p>",
  },
  {
    id: 14,
    category_id: 2,
    name: "Гофрокороб 400×300×400 Т-23",
    slug: "gofrokorob-400-300-400-t-23",
    price: 55.80,
    min_order_qty: 3000,
    dimensions_mm: "400×300×400 мм",
    material_specs: "Т-23 бурый",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Универсальный средний ящик объемом 48 литров из картона <strong>Т-23 бурый</strong>. Выдерживает нагрузку до 20 кг. Востребован в интернет-магазинах и на складах.</p>",
  },
  {
    id: 15,
    category_id: 2,
    name: "Гофрокороб 98×180×185 Т-22",
    slug: "gofrokorob-98-180-185-t-22",
    price: 18.00,
    min_order_qty: 10000,
    dimensions_mm: "98×180×185 мм",
    material_specs: "Т-22",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Узкий четырёхклапанный коробок из картона <strong>Т-22</strong> для штучных изделий и комплектов.</p>",
  },

  // ── 3. Коробки для пиццы ──
  {
    id: 16,
    category_id: 3,
    name: "Коробка для пиццы под заказ по вашим размерам",
    slug: "korobka-dlya-piccy-pod-zakaz",
    price: 0,
    min_order_qty: 1000,
    dimensions_mm: "Любые размеры",
    material_specs: "Т-22 / Т-23 бурый и белый",
    in_stock: false,
    is_custom_design: true,
    image_url: null,
    images: [],
    description: "<p>Производство коробок для пиццы и пирогов под заказ. Сертифицированный пищевой картон <strong>Т-22 / Т-23</strong>, отверстия для выхода пара. <em>Возможно нанесение яркой флексопечати логотипа до 4 цветов.</em></p>",
  },

  // ── 4. Упаковочный скотч ──
  {
    id: 17,
    category_id: 4,
    name: "Скотч прозрачный 48 мм × 50/66/72 м (38–47 мкм)",
    slug: "skotch-prozrachnyj-48-mm",
    price: 40.40,
    min_order_qty: 1,
    dimensions_mm: "48 мм × 50/66/72 м",
    material_specs: "38, 40, 43, 45, 47 мкм",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Клейкая упаковочная лента 48 мм на полипропиленовой основе (BOPP) с акриловым клеевым слоем. Отличная адгезия к гофрокартону и стойкость к перепадам температур.</p>",
  },
  {
    id: 18,
    category_id: 4,
    name: "Скотч прозрачный 72 мм × 50/66/72 м (38–47 мкм)",
    slug: "skotch-prozrachnyj-72-mm",
    price: 52.00,
    min_order_qty: 1,
    dimensions_mm: "72 мм × 50/66/72 м",
    material_specs: "38, 40, 43, 45, 47 мкм",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Широкий скотч 72 мм для тяжёлых коробок (от 15 кг) и фиксации грузов на паллетах. Увеличенная площадь сцепления предотвращает случайный разрыв.</p>",
  },
  {
    id: 19,
    category_id: 4,
    name: "Скотч «ОСТОРОЖНО ХРУПКОЕ»",
    slug: "skotch-ostorozhno-hrupkoe",
    price: 70.30,
    min_order_qty: 1,
    dimensions_mm: "48 мм × 66 м",
    material_specs: "Высокая клейкость, сигнальный",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Сигнальная красно-белая клейкая лента с предупреждающей надписью «ОСТОРОЖНО ХРУПКОЕ / FRAGILE» для бережного обращения с грузом.</p>",
  },
  {
    id: 20,
    category_id: 4,
    name: "Скотч цветной (синий, красный, зелёный, оранжевый)",
    slug: "skotch-cvetnoj",
    price: 0,
    min_order_qty: 36,
    dimensions_mm: "48 мм / 72 мм",
    material_specs: "Под заказ",
    in_stock: false,
    is_custom_design: true,
    image_url: null,
    images: [],
    description: "<p>Цветная упаковочная лента для цветовой дифференциации партий на складе. <em>Изготовление фирменного скотча с логотипом под заказ от 36 рулонов.</em></p>",
  },

  // ── 5. Курьер-пакеты ──
  {
    id: 21,
    category_id: 5,
    name: "Курьер-пакеты белые (от 100×150 до 600×600 мм)",
    slug: "kurer-pakety-belye",
    price: 1.09,
    min_order_qty: 100,
    dimensions_mm: "100×150, 150×210, 170×240, 190×240, 240×320, 430×500, 600×600 мм",
    material_specs: "ПВД трёхслойный с клеевым клапаном",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Трёхслойные непрозрачные полиэтиленовые пакеты (ПВД). Внешняя сторона белая, внутренняя — чёрная светонепроницаемая. Усиленный самоклеящийся деструктивный клапан гарантирует защиту от несанкционированного вскрытия.</p>",
  },

  // ── 6. Пакеты БОПП ──
  {
    id: 22,
    category_id: 6,
    name: "Пакеты БОПП с клеевым клапаном",
    slug: "pakety-bopp-s-kleevym-klapanom",
    price: 5.25,
    min_order_qty: 2000,
    dimensions_mm: "300×420+30, 400×420+30, 400×600+50, 500×420+30 мм",
    material_specs: "25 мкм, возможен логотип",
    in_stock: true,
    is_custom_design: true,
    image_url: null,
    images: [],
    description: "<p>Глянцевые прозрачные пакеты из двуосноориентированного полипропилена (БОПП) толщиной 25 мкм с клейкой лентой на клапане. Идеальная презентационная упаковка для одежды, текстиля и полиграфии. <em>Возможна печать логотипа от 2000 шт.</em></p>",
  },

  // ── 7. Пакеты Zip-Lock с бегунком ──
  {
    id: 23,
    category_id: 7,
    name: "Матовые и прозрачные пакеты Зип-Лок с бегунком",
    slug: "pakety-zip-lock-s-begunkom",
    price: 7.35,
    min_order_qty: 2000,
    dimensions_mm: "200×250, 250×300 мм и под заказ",
    material_specs: "80 мкм, возможен логотип",
    in_stock: true,
    is_custom_design: true,
    image_url: null,
    images: [],
    description: "<p>Плотные матовые пакеты с замком-слайдером (бегунком) плотностью 80 мкм. Стандарт премиум-упаковки одежды и обуви для Wildberries и Ozon. <em>Доступно нанесение логотипа шелкографией.</em></p>",
  },

  // ── 8. Термоэтикетки ──
  {
    id: 24,
    category_id: 8,
    name: "Термоэтикетки ЭКО в рулонах",
    slug: "termoetiketki-eko-v-rulonah",
    price: 94.40,
    min_order_qty: 1,
    dimensions_mm: "58×40/550, 58×40/700, 58×60/400, 58×60/500, 75×120/250, 75×120/300",
    material_specs: "Термо ЭКО",
    in_stock: true,
    is_custom_design: false,
    image_url: null,
    images: [],
    description: "<p>Самоклеящиеся этикетки в рулонах из термобумаги ЭКО. Чёткая печать штрихкодов без риббона. Размеры по стандартам маркетплейсов: 58×40 мм, 75×120 мм (Ozon) и др.</p>",
  },
]

export const SETTINGS = {
  about_title: "О компании «НАМПАК»",
  about_text: "НАМПАК — торгово-производственная компания, специализирующаяся на оптовых и мелкооптовых поставках профессиональных упаковочных материалов: гофрокоробов, самосборных коробок, курьерских пакетов, скотча, пакетов БОПП и Zip-Lock, а также термоэтикеток для маркетплейсов.",
  contact_title: "Контакты компании НАМПАК",
  contact_text: "Свяжитесь с отделом продаж для консультации по тиражам, оптовым ценам, изготовлению упаковки по индивидуальным размерам и брендированию.",
  contact_phone1: "+7 (993) 117-64-92",
  contact_phone2: "+7 (965) 032-61-18",
  contact_email: "nampack@yandex.ru",
  contact_address: "г. Санкт-Петербург, складской комплекс и пункт отгрузки (Пн-Пт: 09:00 - 18:00)",
  contact_inn: "780534396013",
  contact_ogrnip: "325784700428266",
  contact_legal_name: "ООО «НАМПАК» / Отдел оптовых поставок",
  social_tg: "https://t.me/namupak",
  social_max: "https://max.ru/join/CNMJPGqDX3nDW430jTIt4Ft1HDnfe-j1uSjygxIxgRg",
  social_vk: "",
  social_yt: "",
  social_rutube: "",
  payment_title: "Оплата и доставка",
  payment_text: "",
  warranty_return_title: "Возврат и обмен продукции",
  warranty_return_text: "Мы ценим доверие наших партнёров и несём полную финансовую и юридическую ответственность за соответствие отгруженной партии заявленным характеристикам. При обнаружении брака заменяем или возвращаем средства в течение 3 рабочих дней.",
  warranty_period_title: "Стандарты качества",
  warranty_period_text: "Вся продукция НАМПАК соответствует требованиям ГОСТ 9142-2014 и ГОСТ Р 52901-2007. Каждая партия проходит проверку на сопротивление сжатию.",
  privacy_title: "Политика конфиденциальности НАМПАК",
  privacy_text: "",
}

// ── Галерея НАМПАК ──────────────────────────────────────────────────────────
let galleryStore = [
  {
    id: 1,
    image_url: "/logo-nampack.jpg",
    video_url: null,
    title: "Образцы самосборных коробов НАМПАК",
    description: "Самосборные короба из бурого и белого гофрокартона марки Т-23 и Т-22. Точная лазерная высечка замков.",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 2,
    image_url: null,
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "Линия производства и биговки гофрокартона",
    description: "Автоматизированная линия нарезки, нанесения рилевок и сборки коробок крупными тиражами.",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 3,
    image_url: "/logo-nampack.jpg",
    video_url: null,
    title: "Флексопечать логотипа на курьер-пакетах",
    description: "Пример нанесения фирменной символики заказчика на трёхслойные курьерские пакеты в 2 цвета.",
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
]

// ── Разделы обучения ────────────────────────────────────────────────────────
let trainingSectionsStore = [
  { id: 1, name: "Стандарты маркетплейсов (WB / Ozon)", type: "training" },
  { id: 2, name: "Марки и свойства картона", type: "training" },
  { id: 3, name: "Брендирование и печать", type: "training" },
]

// ── Статьи и публикации НАМПАК ──────────────────────────────────────────────
let articlesStore = [
  {
    id: 1,
    title: "Как выбрать гофрокороба для поставок на Wildberries и Ozon",
    content: "<p>При поставках товаров на склады маркетплейсов крайне важно соблюдать строгие требования к упаковке. Основным стандартом для монопаллет и микс-коробов является короб 600×400×400 мм марки Т-23. Для индивидуальной упаковки товаров отлично подходят самосборные коробки типов «самолёт» с надёжными замками.</p><p>В статье рассмотрены допустимые размеры, плотность картона и правила маркировки штрихкодами 58×40 мм.</p>",
    type: "training",
    section_id: 1,
    image_url: null,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    section: { id: 1, name: "Стандарты маркетплейсов (WB / Ozon)" },
  },
  {
    id: 2,
    title: "Чем отличается гофрокартон Т-23 от Т-22: практическое сравнение",
    content: "<p>Марка гофрокартона обозначает количество слоёв (буква Т — трёхслойный) и класс плотности сырья (22 или 23). Картон Т-23 содержит более плотные лайнеры и волнистый флютинг, за счёт чего выдерживает на 25% большее давление на торцевое сжатие (ECT). Если вес вложения превышает 5 кг — всегда выбирайте Т-23.</p>",
    type: "training",
    section_id: 2,
    image_url: null,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    section: { id: 2, name: "Марки и свойства картона" },
  },
  {
    id: 3,
    title: "НАМПАК расширяет складские запасы белых самосборных коробок в Санкт-Петербурге",
    content: "<p>Рады сообщить, что на нашем распределительном складе в Санкт-Петербурге пополнено наличие белых коробок из микрогофрокартона Т-22 (Е) популярных типоразмеров: 285×95×95 мм, 150×130×45 мм и 161×119×37 мм. Отгрузка возможна в день заказа!</p>",
    type: "news",
    section_id: null,
    image_url: null,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
]

// ── Заказы в памяти dev-сервера ─────────────────────────────────────────────
let ordersStore = [
  {
    id: 1,
    order_id: "NAM-2611-1001",
    status: "pending",
    guest_name: "ООО «СевЗапЛогистик»",
    guest_phone: "+7 (921) 555-44-33",
    guest_email: "logistics@sevzap.ru",
    company_name: "ООО «СевЗапЛогистик» (ИНН 7801234567)",
    delivery_type: "delivery",
    delivery_address: "г. Санкт-Петербург, Московское шоссе, д. 25, склад 4",
    client_comment: "Просьба выставить счёт с НДС и приложить паспорта качества картона.",
    total_amount: 141750.00,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    items: [
      {
        id: 1,
        product_name: "Короб самосборный 220×165×100 Т-23 ТИП Д",
        product_price: 10.50,
        quantity: 13500,
      }
    ]
  }
]

let productsStore = [...PRODUCTS]
let categoriesStore = [...CATEGORIES]

/**
 * Плагин Vite для обработки API-запросов НАМПАК
 */
export function nampackMockApiPlugin() {
  return {
    name: 'nampack-mock-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const urlObj = new URL(req.url, 'http://localhost')
        const pathname = urlObj.pathname

        if (!pathname.startsWith('/api/')) {
          return next()
        }

        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          return res.end()
        }

        // 1. Категории: GET /api/categories/
        if (pathname === '/api/categories/' || pathname === '/api/categories') {
          res.statusCode = 200
          return res.end(JSON.stringify(categoriesStore))
        }

        // 2. Список товаров: GET /api/products/
        if (pathname === '/api/products/' || pathname === '/api/products') {
          const categoryId = urlObj.searchParams.get('category_id')
          const search = urlObj.searchParams.get('search')

          let result = [...productsStore]
          if (categoryId) {
            result = result.filter(p => p.category_id === parseInt(categoryId))
          }
          if (search) {
            const q = search.toLowerCase()
            result = result.filter(p =>
              p.name.toLowerCase().includes(q) ||
              (p.dimensions_mm && p.dimensions_mm.toLowerCase().includes(q)) ||
              (p.material_specs && p.material_specs.toLowerCase().includes(q))
            )
          }

          res.statusCode = 200
          return res.end(JSON.stringify(result))
        }

        // 3. Детальный товар: GET /api/products/:slug
        const productMatch = pathname.match(/^\/api\/products\/([^/]+)$/)
        if (productMatch && req.method === 'GET') {
          const slug = productMatch[1]
          const product = productsStore.find(p => p.slug === slug || String(p.id) === slug)
          if (product) {
            res.statusCode = 200
            return res.end(JSON.stringify(product))
          } else {
            res.statusCode = 404
            return res.end(JSON.stringify({ detail: "Товар не найден" }))
          }
        }

        // 4. Настройки сайта: GET /api/settings/
        if (pathname === '/api/settings/' || pathname === '/api/settings') {
          res.statusCode = 200
          return res.end(JSON.stringify(SETTINGS))
        }

        // 5. Корзина: GET, POST, DELETE /api/cart/...
        if (pathname.startsWith('/api/cart/')) {
          res.statusCode = 200
          return res.end(JSON.stringify({ items: [], total: 0 }))
        }

        // 6. Оформление заказа: POST /api/checkout/
        if (pathname === '/api/checkout/' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}')
              const orderId = `NAM-${Math.floor(1000 + Math.random() * 9000)}`
              const newOrder = {
                id: ordersStore.length + 1,
                order_id: orderId,
                status: 'pending',
                guest_name: data.guest_name || 'Клиент',
                guest_phone: data.guest_phone || '',
                guest_email: data.guest_email || '',
                company_name: data.company_name || null,
                delivery_type: data.delivery_type || 'delivery',
                delivery_address: data.delivery_address || '',
                client_comment: data.client_comment || '',
                total_amount: data.total_amount || 0,
                created_at: new Date().toISOString(),
                items: data.items || [],
              }
              ordersStore.unshift(newOrder)

              res.statusCode = 200
              return res.end(JSON.stringify({
                order_id: orderId,
                status: 'created',
                message: 'Заявка принята. Менеджер НАМПАК свяжется с вами для согласования доставки и выставления счёта.'
              }))
            } catch {
              res.statusCode = 400
              return res.end(JSON.stringify({ detail: 'Неверные данные заказа' }))
            }
          })
          return
        }

        // 7. Авторизация админа: POST /api/auth/login
        if (pathname === '/api/auth/login' && req.method === 'POST') {
          res.statusCode = 200
          return res.end(JSON.stringify({
            access_token: 'dev-token-nampack-admin',
            token_type: 'bearer'
          }))
        }

        // 8. Админ API: Заказы
        if (pathname.startsWith('/api/admin/orders')) {
          const statusMatch = pathname.match(/^\/api\/admin\/orders\/(\d+)\/status$/)
          if (statusMatch && req.method === 'PATCH') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              const data = JSON.parse(body || '{}')
              const order = ordersStore.find(o => o.id === parseInt(statusMatch[1]))
              if (order) {
                order.status = data.status
                res.statusCode = 200
                return res.end(JSON.stringify(order))
              }
              res.statusCode = 404
              return res.end(JSON.stringify({ detail: 'Заказ не найден' }))
            })
            return
          }

          res.statusCode = 200
          return res.end(JSON.stringify(ordersStore))
        }

        // 9. Админ API: Товары
        if (pathname.startsWith('/api/admin/products')) {
          const productItemMatch = pathname.match(/^\/api\/admin\/products\/(\d+)$/)
          if (productItemMatch && req.method === 'PATCH') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              const data = JSON.parse(body || '{}')
              const pIndex = productsStore.findIndex(p => p.id === parseInt(productItemMatch[1]))
              if (pIndex !== -1) {
                productsStore[pIndex] = { ...productsStore[pIndex], ...data }
                res.statusCode = 200
                return res.end(JSON.stringify(productsStore[pIndex]))
              }
              res.statusCode = 404
              return res.end(JSON.stringify({ detail: 'Товар не найден' }))
            })
            return
          }
          if (productItemMatch && req.method === 'DELETE') {
            const pId = parseInt(productItemMatch[1])
            productsStore = productsStore.filter(p => p.id !== pId)
            res.statusCode = 200
            return res.end(JSON.stringify({ status: 'ok' }))
          }
          if (pathname === '/api/admin/products/' && req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              const data = JSON.parse(body || '{}')
              const newProd = {
                id: Date.now(),
                ...data,
                in_stock: data.in_stock !== undefined ? data.in_stock : true,
              }
              productsStore.unshift(newProd)
              res.statusCode = 201
              return res.end(JSON.stringify(newProd))
            })
            return
          }

          res.statusCode = 200
          return res.end(JSON.stringify(productsStore))
        }

        // 10. Админ API: Категории
        if (pathname.startsWith('/api/admin/categories')) {
          if (pathname === '/api/admin/categories/reorder' && req.method === 'PATCH') {
            res.statusCode = 200
            return res.end(JSON.stringify({ status: 'ok' }))
          }
          res.statusCode = 200
          return res.end(JSON.stringify(categoriesStore))
        }

        // 11. Админ API: Настройки
        if (pathname.startsWith('/api/admin/settings')) {
          if (req.method === 'PATCH') {
            res.statusCode = 200
            return res.end(JSON.stringify({ status: 'ok' }))
          }
          res.statusCode = 200
          return res.end(JSON.stringify(SETTINGS))
        }

        // 12. ГАЛЕРЕЯ (Админ и Клиент): /api/admin/gallery/ и /api/gallery/
        if (pathname.startsWith('/api/admin/gallery') || pathname.startsWith('/api/gallery')) {
          const galleryItemMatch = pathname.match(/^\/api\/admin\/gallery\/(\d+)$/)
          if (galleryItemMatch && req.method === 'DELETE') {
            const id = parseInt(galleryItemMatch[1])
            galleryStore = galleryStore.filter(item => item.id !== id)
            res.statusCode = 200
            return res.end(JSON.stringify({ status: 'ok' }))
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                const data = JSON.parse(body || '{}')
                const newItem = {
                  id: Date.now(),
                  image_url: data.image_url || null,
                  video_url: data.video_url || null,
                  title: data.title || (data.video_url ? 'Видео процесса' : 'Образец продукции'),
                  description: data.description || '',
                  created_at: new Date().toISOString(),
                }
                galleryStore.unshift(newItem)
                res.statusCode = 201
                return res.end(JSON.stringify(newItem))
              } catch (err) {
                console.error('Gallery POST error:', err, 'Body:', body)
                res.statusCode = 400
                return res.end(JSON.stringify({ detail: 'Неверные данные: ' + err.message }))
              }
            })
            return
          }

          res.statusCode = 200
          return res.end(JSON.stringify(galleryStore))
        }

        // 13. СТАТЬИ И КОНТЕНТ (Админ и Клиент)
        // Разделы: /api/admin/articles/sections/training или /api/content/sections
        if (pathname.startsWith('/api/admin/articles/sections') || pathname.startsWith('/api/content/sections')) {
          const secItemMatch = pathname.match(/\/(\d+)$/)
          if (secItemMatch && req.method === 'DELETE') {
            const secId = parseInt(secItemMatch[1])
            trainingSectionsStore = trainingSectionsStore.filter(s => s.id !== secId)
            res.statusCode = 200
            return res.end(JSON.stringify({ status: 'ok' }))
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              const data = JSON.parse(body || '{}')
              const newSec = { id: Date.now(), name: data.name, type: data.type || 'training' }
              trainingSectionsStore.push(newSec)
              res.statusCode = 201
              return res.end(JSON.stringify(newSec))
            })
            return
          }
          res.statusCode = 200
          return res.end(JSON.stringify(trainingSectionsStore))
        }

        // Статьи: /api/admin/articles/ или /api/content/articles
        if (pathname.startsWith('/api/admin/articles') || pathname.startsWith('/api/content/articles')) {
          const articleItemMatch = pathname.match(/^\/api\/admin\/articles\/(\d+)$/)
          if (articleItemMatch && req.method === 'DELETE') {
            const id = parseInt(articleItemMatch[1])
            articlesStore = articlesStore.filter(a => a.id !== id)
            res.statusCode = 200
            return res.end(JSON.stringify({ status: 'ok' }))
          }

          if (articleItemMatch && req.method === 'PATCH') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              const data = JSON.parse(body || '{}')
              const aIndex = articlesStore.findIndex(a => a.id === parseInt(articleItemMatch[1]))
              if (aIndex !== -1) {
                articlesStore[aIndex] = { ...articlesStore[aIndex], ...data }
                res.statusCode = 200
                return res.end(JSON.stringify(articlesStore[aIndex]))
              }
              res.statusCode = 404
              return res.end(JSON.stringify({ detail: 'Статья не найдена' }))
            })
            return
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                const data = JSON.parse(body || '{}')
                const sec = trainingSectionsStore.find(s => s.id === data.section_id)
                const newArt = {
                  id: Date.now(),
                  title: data.title,
                  content: data.content,
                  type: data.type || 'news',
                  section_id: data.section_id || null,
                  image_url: data.image_url || null,
                  created_at: new Date().toISOString(),
                  section: sec ? { id: sec.id, name: sec.name } : null,
                }
                articlesStore.unshift(newArt)
                res.statusCode = 201
                return res.end(JSON.stringify(newArt))
              } catch {
                res.statusCode = 400
                return res.end(JSON.stringify({ detail: 'Ошибка добавления статьи' }))
              }
            })
            return
          }

          const type = urlObj.searchParams.get('type')
          const sectionId = urlObj.searchParams.get('section_id')
          let result = articlesStore
          if (type && type !== 'all') {
            result = result.filter(a => a.type === type)
          }
          if (sectionId) {
            result = result.filter(a => String(a.section_id) === String(sectionId))
          }

          res.statusCode = 200
          return res.end(JSON.stringify(result))
        }

        // 14. Загрузка фото / файлов: POST /api/admin/upload/
        if (pathname === '/api/admin/upload/' && req.method === 'POST') {
          res.statusCode = 200
          return res.end(JSON.stringify({
            url: '/logo-nampack.jpg'
          }))
        }

        // Неизвестный маршрут
        next()
      })
    }
  }
}
