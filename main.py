from contextlib import asynccontextmanager
import asyncio
import logging
import os
from pathlib import Path

import redis.asyncio as aioredis
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

logger = logging.getLogger(__name__)

import sqlalchemy as sa
from app.config import get_settings
from app.database import Base, engine
from app.routers import categories, products, cart, checkout, orders, inquiries
from app.routers import auth, customer_auth
from app.routers import articles as public_articles
from app.routers import gallery  as public_gallery
from app.routers import faq      as public_faq
from app.routers.admin import categories as admin_categories
from app.routers.admin import products  as admin_products
from app.routers.admin import articles  as admin_articles
from app.routers.admin import orders    as admin_orders
from app.routers.admin import upload    as admin_upload
from app.routers.admin import gallery   as admin_gallery
from app.routers.admin import faq       as admin_faq
from app.routers import settings         as public_settings
from app.routers.admin import settings   as admin_settings
# НАМПАК: payments и delivery оставлены в качестве заглушек (роутеры импортированы,
# но НЕ подключены к app — чтобы не ломать импорты внутри orders.py и checkout.py)
import app.routers.payments  # noqa: F401 — заглушка, не подключается к API
import app.routers.delivery  # noqa: F401 — заглушка, не подключается к API

settings = get_settings()

# ── Swagger/OpenAPI: отключаем в продакшне (DEBUG=false) ─────────────────────
_debug = os.getenv("DEBUG", "false").lower() in ("1", "true", "yes")
_docs_url    = "/api/docs"         if _debug else None
_redoc_url   = "/api/redoc"        if _debug else None
_openapi_url = "/api/openapi.json" if _debug else None


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Retry DB connection — the postgres container may need a moment even after
    # the healthcheck passes, especially on first boot.
    for attempt in range(1, 11):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
                # Безопасное добавление новых колонок в существующие таблицы
                await conn.execute(
                    sa.text("ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url VARCHAR(512);")
                )
                await conn.execute(
                    sa.text("ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;")
                )
                await conn.execute(
                    sa.text("""
                        UPDATE categories
                        SET sort_order = sub.rn
                        FROM (
                            SELECT id, ROW_NUMBER() OVER (ORDER BY id ASC) AS rn
                            FROM categories
                        ) sub
                        WHERE categories.id = sub.id AND (categories.sort_order = 0 OR categories.sort_order IS NULL);
                    """)
                )
                await conn.execute(
                    sa.text("CREATE INDEX IF NOT EXISTS ix_categories_sort_order ON categories (sort_order);")
                )
                # НАМПАК: удаление выведенной категории термоэтикетки из БД при запуске
                await conn.execute(
                    sa.text("DELETE FROM products WHERE slug = 'termoetiketki-eko-v-rulonah';")
                )
                await conn.execute(
                    sa.text("DELETE FROM categories WHERE slug = 'termoetiketki';")
                )
                # НАМПАК: корректировка текстов в статьях новостей
                await conn.execute(
                    sa.text("""
                        UPDATE articles
                        SET content = REPLACE(content, 'Отгрузка возможна в день заказа!', '')
                        WHERE content LIKE '%Отгрузка возможна в день заказа!%';
                    """)
                )
                await conn.execute(
                    sa.text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_cost NUMERIC(10, 2) DEFAULT 0.00;")
                )
                await conn.execute(
                    sa.text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS pvz_code VARCHAR(64);")
                )
                await conn.execute(
                    sa.text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS cdek_uuid VARCHAR(64);")
                )
                await conn.execute(
                    sa.text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS cdek_number VARCHAR(64);")
                )
                await conn.execute(
                    sa.text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS cdek_status VARCHAR(64);")
                )
                await conn.execute(
                    sa.text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS cdek_error TEXT;")
                )
                await conn.execute(
                    sa.text("ALTER TABLE products ADD COLUMN IF NOT EXISTS weight_grams INTEGER;")
                )
                await conn.execute(
                    sa.text("ALTER TABLE products ADD COLUMN IF NOT EXISTS length_cm INTEGER;")
                )
                await conn.execute(
                    sa.text("ALTER TABLE products ADD COLUMN IF NOT EXISTS width_cm INTEGER;")
                )
                await conn.execute(
                    sa.text("ALTER TABLE products ADD COLUMN IF NOT EXISTS height_cm INTEGER;")
                )
                await conn.execute(
                    sa.text("ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;")
                )
                await conn.execute(
                    sa.text("""
                        UPDATE products
                        SET sort_order = sub.rn
                        FROM (
                            SELECT id, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY id ASC) AS rn
                            FROM products
                        ) sub
                        WHERE products.id = sub.id AND (products.sort_order = 0 OR products.sort_order IS NULL);
                    """)
                )
                await conn.execute(
                    sa.text("CREATE INDEX IF NOT EXISTS ix_products_sort_order ON products (sort_order);")
                )
                await conn.execute(
                    sa.text("""
                        CREATE TABLE IF NOT EXISTS training_sections (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(128) NOT NULL UNIQUE,
                            slug VARCHAR(128) NOT NULL UNIQUE,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                        );
                    """)
                )
                await conn.execute(
                    sa.text("ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_url VARCHAR(512);")
                )
                await conn.execute(
                    sa.text("ALTER TABLE articles ADD COLUMN IF NOT EXISTS section_id INTEGER REFERENCES training_sections(id) ON DELETE SET NULL;")
                )
                await conn.execute(
                    sa.text("""
                        CREATE TABLE IF NOT EXISTS site_settings (
                            key   VARCHAR(128) PRIMARY KEY,
                            value TEXT NOT NULL DEFAULT ''
                        );
                    """)
                )
                # ── НАМПАК: новые поля продуктов (упаковочная специфика) ────────
                await conn.execute(
                    sa.text("ALTER TABLE products ADD COLUMN IF NOT EXISTS min_order_qty INTEGER DEFAULT 1;")
                )
                await conn.execute(
                    sa.text("ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions_mm VARCHAR(256);")
                )
                await conn.execute(
                    sa.text("ALTER TABLE products ADD COLUMN IF NOT EXISTS material_specs VARCHAR(256);")
                )
                await conn.execute(
                    sa.text("ALTER TABLE products ADD COLUMN IF NOT EXISTS is_custom_design BOOLEAN DEFAULT FALSE;")
                )
                # ── НАМПАК: новые поля заказов (B2B и личный кабинет) ────────────
                await conn.execute(
                    sa.text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;")
                )
                await conn.execute(
                    sa.text("CREATE INDEX IF NOT EXISTS ix_orders_user_id ON orders (user_id);")
                )
                await conn.execute(
                    sa.text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS company_name VARCHAR(256);")
                )
                await conn.execute(
                    sa.text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_type VARCHAR(32) DEFAULT 'delivery';")
                )
                # ── НАМПАК: таблица и дефолтные вопросы FAQ ─────────────────────
                await conn.execute(
                    sa.text("""
                        CREATE TABLE IF NOT EXISTS faq_items (
                            id SERIAL PRIMARY KEY,
                            question VARCHAR(512) NOT NULL,
                            answer TEXT NOT NULL,
                            sort_order INTEGER DEFAULT 0,
                            is_active BOOLEAN DEFAULT TRUE
                        );
                    """)
                )
                await conn.execute(
                    sa.text("CREATE INDEX IF NOT EXISTS ix_faq_items_sort_order ON faq_items (sort_order);")
                )
                await conn.execute(
                    sa.text("CREATE INDEX IF NOT EXISTS ix_faq_items_is_active ON faq_items (is_active);")
                )
                faq_count_res = await conn.execute(sa.text("SELECT COUNT(*) FROM faq_items;"))
                if faq_count_res.scalar() == 0:
                    default_faqs = [
                        (
                            "Как получить оптовую скидку и узнать цену на крупный тираж?",
                            "При заказе партий от 5 000 – 10 000 шт. для производств, маркетплейсов и оптовых баз действуют специальные дилерские цены со скидкой до 25%. Вы можете отправить заявку через сайт, указав требуемый объём в комментарии, или связаться с менеджером по телефону +7 (993) 117-64-92 — мы оперативно рассчитаем индивидуальное коммерческое предложение с учётом логистики.",
                            1,
                        ),
                        (
                            "Можно ли изготовить коробки или пакеты по индивидуальным размерам?",
                            "Да! Мы изготавливаем самосборные и четырёхклапанные гофрокороба любых размеров из трёхслойного картона марок Т-21, Т-22, Т-23, Т-24 (бурый и белый). Срок производства индивидуальной партии со штанцформой составляет от 3 до 5 рабочих дней.",
                            2,
                        ),
                        (
                            "Можно ли нанести наш логотип на упаковку и скотч?",
                            "Да, НАМПАК выполняет профессиональное брендирование: качественная флексопечать на коробках, курьер-пакетах, БОПП и Zip-Lock пакетах с бегунком, а также изготовление брендированного скотча с вашим логотипом и контактными данными. Минимальный тираж брендирования — от 2 000 шт.",
                            3,
                        ),
                        (
                            "Как происходит оплата и доставка заказов?",
                            "Мы работаем с юридическими лицами (с НДС и без НДС), ИП и физическими лицами по всей территории России. После отправки заявки на сайте наш менеджер связывается с вами в течение 15–30 минут, подтверждает параметры, согласует удобную транспортную компанию (Деловые Линии, ПЭК, СДЭК, попутный транспорт) и выставляет официальный счёт. Также возможен бесплатный самовывоз со склада.",
                            4,
                        ),
                    ]
                    for q, a, order in default_faqs:
                        await conn.execute(
                            sa.text(
                                "INSERT INTO faq_items (question, answer, sort_order, is_active) VALUES (:q, :a, :order, TRUE);"
                            ),
                            {"q": q, "a": a, "order": order},
                        )
            # Добавляем новые значения в enum order_status (вне транзакции)
            try:
                async with engine.connect() as auto_conn:
                    await auto_conn.execution_options(isolation_level="AUTOCOMMIT")
                    await auto_conn.execute(
                        sa.text("ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'in_production';")
                    )
                    await auto_conn.execute(
                        sa.text("ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'confirmed';")
                    )
                    await auto_conn.execute(
                        sa.text("ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'completed';")
                    )
            except Exception as e_enum:
                logger.debug("Enum update notice: %s", e_enum)
            break
        except Exception as exc:
            if attempt == 10:
                raise
            logger.warning(
                "DB not ready (attempt %d/10): %s — retrying in 3 s…", attempt, exc
            )
            await asyncio.sleep(3)

    app.state.redis = aioredis.from_url(
        settings.redis_url,
        encoding="utf-8",
        decode_responses=True,
    )

    yield

    await app.state.redis.aclose()
    await engine.dispose()


app = FastAPI(
    title="НАМПАК — API",
    description="Backend B2B/B2C интернет-магазина упаковочных материалов «НАМПАК»",
    version="1.0.0",
    docs_url=_docs_url,
    redoc_url=_redoc_url,
    openapi_url=_openapi_url,
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Продакшн: только HTTPS-домен из переменной окружения ALLOWED_ORIGINS.
# Разработка: дополнительно разрешаем localhost-адреса.
_extra_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]

if _debug:
    # Локальная разработка — разрешаем стандартные порты Vite / CRA
    _dev_origins = [
        "http://localhost",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
    ]
else:
    _dev_origins = []

ALLOWED_ORIGINS = list(dict.fromkeys([*_extra_origins, *_dev_origins]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Статика (загруженные изображения) ────────────────────────────────────────
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ── Публичные эндпоинты ──────────────────────────────────────────────────────
app.include_router(auth.router,              prefix="/api/auth",       tags=["Auth"])
app.include_router(customer_auth.router,     prefix="/api/user",       tags=["Customer · Account"])
app.include_router(categories.router,        prefix="/api/categories", tags=["Categories"])
app.include_router(products.router,          prefix="/api/products",   tags=["Products"])
app.include_router(cart.router,              prefix="/api/cart",       tags=["Cart"])
app.include_router(checkout.router,          prefix="/api/checkout",   tags=["Checkout"])
app.include_router(inquiries.router,         prefix="/api/inquiries",  tags=["Inquiries"])
app.include_router(inquiries.router,         prefix="/api/feedback",   tags=["Inquiries (alias)"])
app.include_router(public_articles.router,   prefix="/api/articles",   tags=["Articles"])
app.include_router(public_articles.router,   prefix="/api/content/articles", tags=["Articles (alias)"])
app.include_router(public_gallery.router,    prefix="/api/gallery",    tags=["Gallery"])
app.include_router(public_faq.router,        prefix="/api/faq",        tags=["FAQ"])
app.include_router(orders.router,            prefix="/api/orders",     tags=["Orders"])
# НАМПАК: payments и delivery — отключены (работа через менеджера).
# Роутеры импортированы выше через `import app.routers.payments/delivery`,
# чтобы не ломать внутренние ссылки. Раскомментируйте строки ниже для включения:
# app.include_router(payments.router,         prefix="/api/payments",   tags=["Payments"])
# app.include_router(delivery.router,         prefix="/api/delivery",   tags=["Delivery"])

# ── Защищённые эндпоинты администратора ──────────────────────────────────────
app.include_router(admin_categories.router,  prefix="/api/admin/categories", tags=["Admin · Categories"])
app.include_router(admin_products.router,    prefix="/api/admin/products",   tags=["Admin · Products"])
app.include_router(admin_articles.router,    prefix="/api/admin/articles",   tags=["Admin · Articles"])
app.include_router(admin_orders.router,      prefix="/api/admin/orders",     tags=["Admin · Orders"])
app.include_router(admin_upload.router,      prefix="/api/admin/upload",     tags=["Admin · Upload"])
app.include_router(admin_gallery.router,     prefix="/api/admin/gallery",    tags=["Admin · Gallery"])
app.include_router(admin_faq.router,         prefix="/api/admin/faq",        tags=["Admin · FAQ"])
app.include_router(public_settings.router,   prefix="/api/settings",         tags=["Settings"])
app.include_router(admin_settings.router,    prefix="/api/admin/settings",   tags=["Admin · Settings"])


@app.get("/api/healthcheck", tags=["System"])
async def healthcheck():
    return {"status": "ok", "version": app.version, "env": settings.app_env}
