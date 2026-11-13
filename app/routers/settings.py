"""
GET /api/settings/ — публичный endpoint.

Возвращает только ключи из ALLOWED_KEYS (whitelist).
Если ключ не найден в БД — возвращает значение по умолчанию из DEFAULTS.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import SiteSettings

router = APIRouter()

# ── Whitelist разрешённых публичных ключей ────────────────────────────────────
ALLOWED_KEYS: set[str] = {
    "about_title",
    "about_text",
    "contact_text",
    "contact_phone1",
    "contact_phone2",
    "contact_address",
    "contact_inn",
    "contact_ogrnip",
    "contact_email",
    "contact_legal_name",
    "social_vk",
    "social_tg",
    "social_yt",
    "social_rutube",
    "social_max",
    "warranty_return_title",
    "warranty_return_text",
    "warranty_period_title",
    "warranty_period_text",
    "privacy_title",
    "privacy_text",
    "payment_title",
    "payment_text",
    "developer_name",
    "developer_url",
    # Настройки СДЭК и отправителя (оставлены для совместимости, не используются)
    "cdek_sender_city_code",
    "cdek_sender_name",
    "cdek_sender_phone",
    "cdek_delivery_type",
    "cdek_sender_pvz_code",
    "cdek_sender_address",
    "cdek_tariff_codes",
}

# ── Значения по умолчанию (НАМПАК) ───────────────────────────────────────────
DEFAULTS: dict[str, str] = {
    "about_title": "О компании НАМПАК",
    "about_text": (
        "НАМПАК — поставщик упаковочных материалов для бизнеса. "
        "Гофрокороба, курьер-пакеты, скотч, БОПП и Zip-Lock пакеты, "
        "термоэтикетки — всё для производства, склада и логистики. "
        "Работаем с юридическими лицами и ИП, выставляем счета, "
        "изготавливаем упаковку с логотипом по индивидуальным размерам."
    ),
    "contact_text": "По вопросам заказа и расчёта свяжитесь с менеджером:",
    "contact_phone1": "+7 (993) 117-64-92",
    "contact_phone2": "+7 (965) 032-61-18",
    "contact_address": "",
    "contact_inn": "",
    "contact_ogrnip": "",
    "contact_email": "nampack@yandex.ru",
    "contact_legal_name": "НАМПАК",
    "social_vk": "",
    "social_tg": "https://t.me/namupak",
    "social_yt": "",
    "social_rutube": "",
    "social_max": "https://max.ru/join/CNMJPGqDX3nDW430jTIt4Ft1HDnfe-j1uSjygxIxgRg",
    "warranty_return_title": "Возврат товара",
    "warranty_return_text": (
        "Возврат и обмен товара осуществляется в соответствии с "
        "действующим законодательством РФ. По всем вопросам обращайтесь "
        "к менеджеру по телефону или email."
    ),
    "warranty_period_title": "Гарантия качества",
    "warranty_period_text": (
        "Мы гарантируем соответствие продукции заявленным характеристикам. "
        "При обнаружении брака — замена или возврат средств."
    ),
    "privacy_title": "Политика конфиденциальности",
    "privacy_text": (
        "Настоящая Политика конфиденциальности описывает, какие персональные "
        "данные собирает НАМПАК, как они используются и защищаются.\n\n"
        "Мы собираем только те данные, которые вы предоставляете при оформлении "
        "заявки: имя, телефон, email и название организации. Данные используются "
        "исключительно для обработки заявки и связи с вами.\n\n"
        "Вставьте финальный текст политики здесь."
    ),
    "payment_title": "Оплата и доставка",
    "payment_text": (
        "Способы оплаты:\n"
        "— Безналичный расчёт (счёт для юридических лиц и ИП)\n"
        "— Наличными при самовывозе\n\n"
        "Доставка:\n"
        "— Самовывоз со склада\n"
        "— Доставка по городу\n"
        "— Транспортными компаниями по России\n"
        "— Индивидуальный расчёт стоимости для крупных заказов\n\n"
        "Вставьте актуальные условия здесь."
    ),
    "developer_name": "",
    "developer_url": "",
    # Настройки СДЭК (заглушки для совместимости)
    "cdek_sender_city_code": "",
    "cdek_sender_name": "",
    "cdek_sender_phone": "",
    "cdek_delivery_type": "pvz",
    "cdek_sender_pvz_code": "",
    "cdek_sender_address": "",
    "cdek_tariff_codes": "136, 368, 234",
}


@router.get("/", summary="Публичные настройки сайта")
async def get_settings(db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    """Возвращает словарь настроек с публичным whitelist ключей."""
    result = await db.execute(
        select(SiteSettings).where(SiteSettings.key.in_(ALLOWED_KEYS))
    )
    rows: dict[str, str] = {row.key: row.value for row in result.scalars().all()}

    # Применяем значения по умолчанию для отсутствующих ключей
    return {key: rows.get(key, default) for key, default in DEFAULTS.items()}
