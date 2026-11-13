"""
Payment provider callbacks — ЗАГЛУШКА (НАМПАК).

ЮKassa отключена. Роутер зарегистрирован в main.py только через импорт
(не подключается к app.include_router). Этот файл сохранён как заглушка,
чтобы не ломать импорты.
"""
from __future__ import annotations

from fastapi import APIRouter
from fastapi.responses import PlainTextResponse

router = APIRouter()


@router.post(
    "/yookassa/webhook",
    response_class=PlainTextResponse,
    summary="Webhook YooKassa (отключён)",
    include_in_schema=False,
)
async def yookassa_webhook_stub() -> str:
    """ЗАГЛУШКА: ЮKassa отключена. Роутер не подключён к API."""
    return "OK"


@router.post(
    "/webhook",
    response_class=PlainTextResponse,
    summary="Webhook YooKassa legacy (отключён)",
    include_in_schema=False,
)
async def yookassa_webhook_legacy_stub() -> str:
    """ЗАГЛУШКА: ЮKassa отключена. Роутер не подключён к API."""
    return "OK"
