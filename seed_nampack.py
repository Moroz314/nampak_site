"""
Скрипт наполнения базы данных реальным каталогом упаковочных материалов компании «НАМПАК».
Запуск: python seed_nampack.py
"""
import sys
import asyncio
from decimal import Decimal

# Настройка кодировки вывода для консоли Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from sqlalchemy import text
from app.database import AsyncSessionLocal
from app.models import Category, Product, Gallery, Article, ArticleType, TrainingSection

# ── 8 Категорий упаковки НАМПАК ──────────────────────────────────────────────
CATEGORIES = [
    {
        "name": "Самосборные короба",
        "slug": "samosbornye-koroba",
        "sort_order": 1,
    },
    {
        "name": "Четырёхклапанные гофрокороба",
        "slug": "chetyrehklapannye-gofrokoroba",
        "sort_order": 2,
    },
    {
        "name": "Коробки для пиццы",
        "slug": "korobki-dlya-piccy",
        "sort_order": 3,
    },
    {
        "name": "Упаковочный скотч",
        "slug": "upakovochnyj-skotch",
        "sort_order": 4,
    },
    {
        "name": "Курьер-пакеты",
        "slug": "kurer-pakety",
        "sort_order": 5,
    },
    {
        "name": "Пакеты БОПП",
        "slug": "pakety-bopp",
        "sort_order": 6,
    },
    {
        "name": "Пакеты Zip-Lock с бегунком",
        "slug": "pakety-zip-lock-s-begunkom",
        "sort_order": 7,
    },
    {
        "name": "Термоэтикетки",
        "slug": "termoetiketki",
        "sort_order": 8,
    },
]

# ── 24 Товара каталога НАМПАК ────────────────────────────────────────────────
PRODUCTS = [
    # ── 1. Самосборные короба ────────────────────────────────────────────────
    {
        "category_slug": "samosbornye-koroba",
        "name": "Короб самосборный 220×165×100 Т-23 ТИП Д",
        "slug": "korob-samosbornyj-220-165-100-t-23-tip-d",
        "price": Decimal("10.50"),
        "min_order_qty": 13500,
        "dimensions_mm": "220×165×100 мм",
        "material_specs": "Т-23 ТИП Д",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Самосборный короб типа «самолёт» из бурого трёхслойного гофрокартона марки <strong>Т-23 ТИП Д</strong>. Оптимален для фасовки товаров на маркетплейсах (Wildberries, Ozon, Яндекс Маркет), почтовых и курьерских отправлений. Быстро и легко собирается по линиям биговки без применения скотча.</p>",
    },
    {
        "category_slug": "samosbornye-koroba",
        "name": "Короб самосборный 260×170×80 Т-23 ТИП Ж",
        "slug": "korob-samosbornyj-260-170-80-t-23-tip-zh",
        "price": Decimal("11.10"),
        "min_order_qty": 13000,
        "dimensions_mm": "260×170×80 мм",
        "material_specs": "Т-23 ТИП Ж",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Универсальный самосборный короб 260×170×80 мм из прочного гофрокартона <strong>Т-23 ТИП Ж</strong>. Усиленные боковые стенки защищают содержимое от ударов и сдавливания при транспортировке сборных грузов.</p>",
    },
    {
        "category_slug": "samosbornye-koroba",
        "name": "Короб самосборный 265×165×50 Т-23 ТИП Е",
        "slug": "korob-samosbornyj-265-165-50-t-23-tip-e",
        "price": Decimal("9.70"),
        "min_order_qty": 15000,
        "dimensions_mm": "265×165×50 мм",
        "material_specs": "Т-23 ТИП Е",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Плоский компактный самосборный короб высотой 50 мм из микрогофрокартона <strong>Т-23 профиль Е</strong>. Идеален для аксессуаров, текстиля, плоских гаджетов, полиграфии и подарочных наборов.</p>",
    },
    {
        "category_slug": "samosbornye-koroba",
        "name": "Короб самосборный 265×165×50 Т-22 ТИП Е",
        "slug": "korob-samosbornyj-265-165-50-t-22-tip-e",
        "price": Decimal("9.30"),
        "min_order_qty": 15000,
        "dimensions_mm": "265×165×50 мм",
        "material_specs": "Т-22 ТИП Е",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Экономичный вариант плоского самосборного короба из микрогофрокартона марки <strong>Т-22 ТИП Е</strong>. Выгодное решение для крупных оптовых партий упаковки легкой продукции.</p>",
    },
    {
        "category_slug": "samosbornye-koroba",
        "name": "Короб самосборный 265×165×190 Т-23 ТИП Г",
        "slug": "korob-samosbornyj-265-165-190-t-23-tip-g",
        "price": Decimal("16.70"),
        "min_order_qty": 9000,
        "dimensions_mm": "265×165×190 мм",
        "material_specs": "Т-23 ТИП Г",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Глубокий самосборный короб с высотой 190 мм. Прочный трёхслойный бурый гофрокартон <strong>Т-23 ТИП Г</strong> выдерживает штабелирование и защищает высокие и объёмные товары.</p>",
    },
    {
        "category_slug": "samosbornye-koroba",
        "name": "Короб 285×95×95 Т-22 Белый (Е)",
        "slug": "korob-285-95-95-t-22-belyj-e",
        "price": Decimal("14.90"),
        "min_order_qty": 15000,
        "dimensions_mm": "285×95×95 мм",
        "material_specs": "Т-22 Белый (Е) трёхслойный",
        "in_stock": True,
        "is_custom_design": True,
        "description": "<p>Удлиненный презентационный короб из белого микрогофрокартона <strong>Т-22 профиль Е</strong>. Отлично подходит для бутылок, термосов, тубусов, свечей и сувениров. <em>Доступно нанесение логотипа методом флексопечати.</em></p>",
    },
    {
        "category_slug": "samosbornye-koroba",
        "name": "Короб 150×130×45 Т-22 Белый",
        "slug": "korob-150-130-45-t-22-belyj",
        "price": Decimal("10.20"),
        "min_order_qty": 15000,
        "dimensions_mm": "150×130×45 мм",
        "material_specs": "Т-22 Белый",
        "in_stock": True,
        "is_custom_design": True,
        "description": "<p>Маленький аккуратный белый самосборный коробок из картона <strong>Т-22</strong>. Эстетичная упаковка для ювелирных изделий, бижутерии, косметики, электроники и подарков. <em>Возможна печать фирменной символики.</em></p>",
    },
    {
        "category_slug": "samosbornye-koroba",
        "name": "Короб 161×119×37 Т-22 Белый",
        "slug": "korob-161-119-37-t-22-belyj",
        "price": Decimal("15.50"),
        "min_order_qty": 5000,
        "dimensions_mm": "161×119×37 мм",
        "material_specs": "Т-22 Белый",
        "in_stock": True,
        "is_custom_design": True,
        "description": "<p>Премиальный самосборный короб из белого гофрокартона <strong>Т-22</strong> с откидной крышкой. Отличное качество высечки и биговки. <em>Возможно брендирование тиражей от 2000 шт.</em></p>",
    },

    # ── 2. Четырёхклапанные гофрокороба ──────────────────────────────────────
    {
        "category_slug": "chetyrehklapannye-gofrokoroba",
        "name": "Гофрокороб 600×400×400 Т-23",
        "slug": "gofrokorob-600-400-400-t-23",
        "price": Decimal("89.90"),
        "min_order_qty": 2000,
        "dimensions_mm": "600×400×400 мм",
        "material_specs": "Т-23 бурый",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Стандартный логистический гофрокороб №1 объемом 96 литров из прочного гофрокартона <strong>Т-23 бурый</strong>. Основной стандарт поставок монопаллет и микс-коробов на склады маркетплейсов Wildberries, Ozon, а также для переездов и хранения.</p>",
    },
    {
        "category_slug": "chetyrehklapannye-gofrokoroba",
        "name": "Гофрокороб 200×190×130 Т-23",
        "slug": "gofrokorob-200-190-130-t-23",
        "price": Decimal("12.90"),
        "min_order_qty": 11000,
        "dimensions_mm": "200×190×130 мм",
        "material_specs": "Т-23 бурый",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Компактный четырёхклапанный ящик (FEFCO 0201) из бурого картона <strong>Т-23</strong>. Применяется для отправки автозапчастей, мелкой фурнитуры, крепежа и штучных заказов.</p>",
    },
    {
        "category_slug": "chetyrehklapannye-gofrokoroba",
        "name": "Гофрокороб 250×250×250 Т-23",
        "slug": "gofrokorob-250-250-250-t-23",
        "price": Decimal("27.10"),
        "min_order_qty": 5600,
        "dimensions_mm": "250×250×250 мм",
        "material_specs": "Т-23 бурый",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Кубический гофрокороб 25×25×25 см из картона <strong>Т-23 бурый</strong>. Оптимальная форма для фасовки посуды, сухих смесей, банок, химической продукции и круглой тары.</p>",
    },
    {
        "category_slug": "chetyrehklapannye-gofrokoroba",
        "name": "Гофрокороб 380×253×237 Т-23",
        "slug": "gofrokorob-380-253-237-t-23",
        "price": Decimal("35.40"),
        "min_order_qty": 4600,
        "dimensions_mm": "380×253×237 мм",
        "material_specs": "Т-23 бурый",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Паллетный ящик из трёхслойного картона <strong>Т-23 бурый</strong>. Размеры кратны габаритам европаллеты (1200×800 мм), что обеспечивает устойчивую штабелевку без провисаний.</p>",
    },
    {
        "category_slug": "chetyrehklapannye-gofrokoroba",
        "name": "Гофрокороб 310×260×380 Т-23",
        "slug": "gofrokorob-310-260-380-t-23",
        "price": Decimal("41.90"),
        "min_order_qty": 3900,
        "dimensions_mm": "310×260×380 мм",
        "material_specs": "Т-23 бурый",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Высокий вертикальный гофрокороб из картона <strong>Т-23 бурый</strong>. Разработан для бутылочной продукции, книг, папок-регистраторов и высокой фасовки.</p>",
    },
    {
        "category_slug": "chetyrehklapannye-gofrokoroba",
        "name": "Гофрокороб 400×300×400 Т-23",
        "slug": "gofrokorob-400-300-400-t-23",
        "price": Decimal("55.80"),
        "min_order_qty": 3000,
        "dimensions_mm": "400×300×400 мм",
        "material_specs": "Т-23 бурый",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Универсальный упаковочный ящик объемом 48 литров из картона <strong>Т-23 бурый</strong>. Выдерживает нагрузку до 15–20 кг. Востребован в интернет-магазинах и на производствах.</p>",
    },
    {
        "category_slug": "chetyrehklapannye-gofrokoroba",
        "name": "Гофрокороб 98×180×185 Т-22",
        "slug": "gofrokorob-98-180-185-t-22",
        "price": Decimal("18.00"),
        "min_order_qty": 10000,
        "dimensions_mm": "98×180×185 мм",
        "material_specs": "Т-22",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Узкий четырёхклапанный коробок из картона <strong>Т-22</strong> для фасовки штучных изделий и комплектов.</p>",
    },

    # ── 3. Коробки для пиццы ────────────────────────────────────────────────
    {
        "category_slug": "korobki-dlya-piccy",
        "name": "Коробка для пиццы под заказ по вашим размерам",
        "slug": "korobka-dlya-piccy-pod-zakaz",
        "price": Decimal("0.00"),
        "min_order_qty": 1000,
        "dimensions_mm": "Любые размеры",
        "material_specs": "Т-22 / Т-23 бурый и белый",
        "in_stock": False,
        "is_custom_design": True,
        "description": "<p>Изготовление специализированных коробок для пиццы и осетинских пирогов под заказ со скошенными или прямыми углами. Пищевой картон марки <strong>Т-22 / Т-23</strong>, отверстия для отвода пара, сохранение жесткости при высокой температуре. <em>Возможно нанесение цветной печати логотипа до 4 цветов. Срок изготовления от 5 дней.</em></p>",
    },

    # ── 4. Упаковочный скотч ─────────────────────────────────────────────────
    {
        "category_slug": "upakovochnyj-skotch",
        "name": "Скотч прозрачный 48 мм × 50/66/72 м (38–47 мкм)",
        "slug": "skotch-prozrachnyj-48-mm",
        "price": Decimal("40.40"),
        "min_order_qty": 1,
        "dimensions_mm": "48 мм × 50/66/72 м",
        "material_specs": "38, 40, 43, 45, 47 мкм",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Качественная клейкая упаковочная лента шириной 48 мм на полипропиленовой основе (BOPP) с акриловым клеевым слоем. Плотность от 38 до 47 мкм обеспечивает надёжное запечатывание гофротары даже при низких температурах.</p>",
    },
    {
        "category_slug": "upakovochnyj-skotch",
        "name": "Скотч прозрачный 72 мм × 50/66/72 м (38–47 мкм)",
        "slug": "skotch-prozrachnyj-72-mm",
        "price": Decimal("52.00"),
        "min_order_qty": 1,
        "dimensions_mm": "72 мм × 50/66/72 м",
        "material_specs": "38, 40, 43, 45, 47 мкм",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Широкий скотч 72 мм для тяжёлых коробов, запечатывания крупногабаритных партий и фиксации грузов на паллетах. Увеличенная площадь сцепления предотвращает разрыв шва при перевозке.</p>",
    },
    {
        "category_slug": "upakovochnyj-skotch",
        "name": "Скотч «ОСТОРОЖНО ХРУПКОЕ»",
        "slug": "skotch-ostorozhno-hrupkoe",
        "price": Decimal("70.30"),
        "min_order_qty": 1,
        "dimensions_mm": "48 мм × 66 м",
        "material_specs": "Высокая клейкость, сигнальный",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Сигнальная красно-белая клейкая лента с надписью «ОСТОРОЖНО ХРУПКОЕ / FRAGILE». Информирует логистические службы и грузчиков о необходимости бережного обращения с грузом.</p>",
    },
    {
        "category_slug": "upakovochnyj-skotch",
        "name": "Скотч цветной (синий, красный, зелёный, оранжевый)",
        "slug": "skotch-cvetnoj",
        "price": Decimal("0.00"),
        "min_order_qty": 36,
        "dimensions_mm": "48 мм / 72 мм",
        "material_specs": "Под заказ",
        "in_stock": False,
        "is_custom_design": True,
        "description": "<p>Цветная упаковочная лента для цветовой дифференциации заказов, зон склада или брендирования. <em>Изготавливается под заказ от 36 рулонов. Возможно нанесение логотипа компании.</em></p>",
    },

    # ── 5. Курьер-пакеты ─────────────────────────────────────────────────────
    {
        "category_slug": "kurer-pakety",
        "name": "Курьер-пакеты белые (от 100×150 до 600×600 мм)",
        "slug": "kurer-pakety-belye",
        "price": Decimal("1.09"),
        "min_order_qty": 100,
        "dimensions_mm": "100×150, 150×210, 170×240, 190×240, 240×320, 430×500, 600×600 мм",
        "material_specs": "ПВД трёхслойный с клеевым клапаном",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Пакеты из трёхслойного светонепроницаемого полиэтилена (ПВД). Внешняя сторона белая (удобно наклеивать термоэтикетки и делать пометки маркером), внутренняя сторона — чёрная. Самоклеящийся деструктивный клапан гарантирует защиту от несанкционированного вскрытия.</p>",
    },

    # ── 6. Пакеты БОПП ───────────────────────────────────────────────────────
    {
        "category_slug": "pakety-bopp",
        "name": "Пакеты БОПП с клеевым клапаном",
        "slug": "pakety-bopp-s-kleevym-klapanom",
        "price": Decimal("5.25"),
        "min_order_qty": 2000,
        "dimensions_mm": "300×420+30, 400×420+30, 400×600+50, 500×420+30 мм",
        "material_specs": "25 мкм, возможен логотип",
        "in_stock": True,
        "is_custom_design": True,
        "description": "<p>Высокопрозрачные глянцевые полипропиленовые пакеты (БОПП) толщиной 25 мкм с клейкой лентой на клапане. Идеальная презентационная упаковка для одежды, текстиля, сувениров и полиграфии. <em>Доступна индивидуальная флексопечать логотипа от 2000 шт.</em></p>",
    },

    # ── 7. Пакеты Zip-Lock с бегунком ────────────────────────────────────────
    {
        "category_slug": "pakety-zip-lock-s-begunkom",
        "name": "Матовые и прозрачные пакеты Зип-Лок с бегунком",
        "slug": "pakety-zip-lock-s-begunkom",
        "price": Decimal("7.35"),
        "min_order_qty": 2000,
        "dimensions_mm": "200×250, 250×300 мм и под заказ",
        "material_specs": "80 мкм, возможен логотип",
        "in_stock": True,
        "is_custom_design": True,
        "description": "<p>Плотные многоразовые пакеты со слайдером-бегунком и вентиляционным микроотверстием. Изготовлены из тактильного матового EVA/ПВД материала плотностью 80 мкм. Стандарт упаковки одежды и обуви для Wildberries и Ozon. <em>Нанесение фирменного логотипа шелкографией.</em></p>",
    },

    # ── 8. Термоэтикетки ─────────────────────────────────────────────────────
    {
        "category_slug": "termoetiketki",
        "name": "Термоэтикетки ЭКО в рулонах",
        "slug": "termoetiketki-eko-v-rulonah",
        "price": Decimal("94.40"),
        "min_order_qty": 1,
        "dimensions_mm": "58×40/550, 58×40/700, 58×60/400, 58×60/500, 75×120/250, 75×120/300",
        "material_specs": "Термо ЭКО",
        "in_stock": True,
        "is_custom_design": False,
        "description": "<p>Самоклеящиеся термоэтикетки в рулонах из термобумаги ЭКО. Чёткая контрастная печать штрихкодов и QR-кодов без риббона. Совместимы со всеми популярными термопринтерами (Xprinter, TSC, Godex). Размеры по стандартам маркетплейсов: 58×40 мм, 75×120 мм (для Ozon) и др.</p>",
    },
]


async def seed():
    print("=" * 60)
    print(" НАМПАК: Наполнение базы данных реальным каталогом упаковки")
    print("=" * 60)

    async with AsyncSessionLocal() as session:
        # 1. Очистка старых товаров и категорий
        print("\n[1/3] Очистка базы данных от старых товаров...")
        # Удаляем связи картинок и позиции заказов при необходимости
        try:
            await session.execute(text("DELETE FROM product_images"))
        except Exception:
            pass

        await session.execute(text("DELETE FROM order_items"))
        await session.execute(text("DELETE FROM products"))
        await session.execute(text("DELETE FROM categories"))
        await session.commit()
        print("  ✓ Старые записи успешно удалены.")

        # 2. Создание категорий НАМПАК
        print("\n[2/3] Создание 8 категорий упаковки...")
        cat_map = {}
        for cat_data in CATEGORIES:
            cat = Category(
                name=cat_data["name"],
                slug=cat_data["slug"],
                sort_order=cat_data["sort_order"],
            )
            session.add(cat)
            await session.flush()
            cat_map[cat_data["slug"]] = cat.id
            print(f"  + [{cat.sort_order}] {cat.name} (slug: {cat.slug})")

        await session.commit()

        # 3. Создание 24 товаров
        print("\n[3/3] Добавление 24 реальных товаров НАМПАК...")
        cat_sort_order = {}
        for idx, p in enumerate(PRODUCTS, start=1):
            c_slug = p["category_slug"]
            c_id = cat_map[c_slug]
            cat_sort_order[c_id] = cat_sort_order.get(c_id, 0) + 1

            product = Product(
                name=p["name"],
                slug=p["slug"],
                price=p["price"],
                description=p["description"],
                category_id=c_id,
                in_stock=p["in_stock"],
                sort_order=cat_sort_order[c_id],
                min_order_qty=p["min_order_qty"],
                dimensions_mm=p["dimensions_mm"],
                material_specs=p["material_specs"],
                is_custom_design=p["is_custom_design"],
            )
            session.add(product)
            stock_tag = "В наличии" if p["in_stock"] else "Под заказ"
            price_tag = f"{p['price']} ₽/шт" if p['price'] > 0 else "Цена по запросу"
            print(f"  {idx:2d}. {product.name} | {price_tag} | от {product.min_order_qty} шт. | [{stock_tag}]")

        await session.commit()

        # 4. Создание разделов обучения и статей
        print("\n[4/5] Добавление разделов и статей...")
        sec1 = TrainingSection(name="Стандарты маркетплейсов (WB / Ozon)", slug="standarty-marketplejsov")
        sec2 = TrainingSection(name="Марки и свойства картона", slug="marki-i-svojstva-kartona")
        sec3 = TrainingSection(name="Брендирование и печать", slug="brendirovanie-i-pechat")
        session.add_all([sec1, sec2, sec3])
        await session.commit()

        articles = [
            Article(
                title="Как выбрать гофрокороба для поставок на Wildberries и Ozon",
                content="<p>При поставках товаров на склады маркетплейсов крайне важно соблюдать строгие требования к упаковке. Основным стандартом для монопаллет и микс-коробов является короб 600×400×400 мм марки Т-23. Для индивидуальной упаковки товаров отлично подходят самосборные коробки типов «самолёт» с надёжными замками.</p><p>В статье рассмотрены допустимые размеры, плотность картона и правила маркировки штрихкодами 58×40 мм.</p>",
                type=ArticleType.training,
                section_id=sec1.id,
                image_url=None,
            ),
            Article(
                title="Чем отличается гофрокартон Т-23 от Т-22: практическое сравнение",
                content="<p>Марка гофрокартона обозначает количество слоёв (буква Т — трёхслойный) и класс плотности сырья (22 или 23). Картон Т-23 содержит более плотные лайнеры и волнистый флютинг, за счёт чего выдерживает на 25% большее давление на торцевое сжатие (ECT). Если вес вложения превышает 5 кг — всегда выбирайте Т-23.</p>",
                type=ArticleType.training,
                section_id=sec2.id,
                image_url=None,
            ),
            Article(
                title="НАМПАК расширяет складские запасы белых самосборных коробок в Санкт-Петербурге",
                content="<p>Рады сообщить, что на нашем распределительном складе в Санкт-Петербурге пополнено наличие белых коробок из микрогофрокартона Т-22 (Е) популярных типоразмеров: 285×95×95 мм, 150×130×45 мм и 161×119×37 мм. Отгрузка возможна в день заказа!</p>",
                type=ArticleType.news,
                section_id=None,
                image_url=None,
            ),
        ]
        session.add_all(articles)
        await session.commit()
        print(f"  + Добавлено 3 раздела и 3 статьи")

        # 5. Галерея работ
        print("\n[5/5] Добавление материалов в галерею...")
        gallery_items = [
            Gallery(
                image_url="/logo-nampack.jpg",
                video_url=None,
                description="Самосборные короба из бурого и белого гофрокартона марки Т-23 и Т-22. Точная лазерная высечка замков.",
            ),
            Gallery(
                image_url=None,
                video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                description="Автоматизированная линия нарезки, нанесения рилевок и сборки коробок крупными тиражами.",
            ),
            Gallery(
                image_url="/logo-nampack.jpg",
                video_url=None,
                description="Пример нанесения фирменной символики заказчика на трёхслойные курьерские пакеты в 2 цвета.",
            ),
        ]
        session.add_all(gallery_items)
        await session.commit()
        print(f"  + Добавлено 3 материала в галерею")

        print("\n" + "=" * 60)
        print(f" УСПЕХ: База данных НАМПАК заполнена!")
        print(f" Добавлено категорий: {len(CATEGORIES)}")
        print(f" Добавлено товаров:   {len(PRODUCTS)}")
        print(f" Добавлено статей:    3")
        print(f" Добавлено в галерею: 3")
        print("=" * 60)


if __name__ == "__main__":
    asyncio.run(seed())

