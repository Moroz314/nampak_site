"""Router for quick inquiries (индивидуальный запрос на расчет / изготовление)."""
from __future__ import annotations

import random
import string
from decimal import Decimal

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.models import Order, OrderStatus
from app.services.email_service import send_new_order_email
from app.services.telegram_service import send_telegram_message

router = APIRouter()


class InquiryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=128)
    phone: str = Field(..., min_length=5, max_length=64)
    company: str | None = Field(default=None, max_length=256)
    message: str | None = Field(default=None, max_length=2048)


def _gen_inquiry_id() -> str:
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"REQ-{suffix}"


def _notify_inquiry(inquiry_data: dict):
    # 1. Отправка в Telegram
    req_id = inquiry_data.get("order_id", "—")
    tg_text = (
        f"📩 <b>Индивидуальный запрос #{req_id} (НАМПАК)</b>\n\n"
        f"👤 <b>Имя:</b> {inquiry_data.get('customer_name')}\n"
        f"📞 <b>Телефон:</b> {inquiry_data.get('customer_phone')}\n"
        f"🏢 <b>Организация/ИНН:</b> {inquiry_data.get('company_name') or '—'}\n"
        f"💬 <b>Запрос:</b> {inquiry_data.get('comment') or '—'}\n"
    )
    send_telegram_message(tg_text)

    # 2. Отправка Email администратору
    send_new_order_email(inquiry_data)


@router.post("/", summary="Отправить быстрый запрос на расчёт")
async def create_inquiry(
    body: InquiryCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    req_id = _gen_inquiry_id()
    settings = get_settings()

    order = Order(
        order_id=req_id,
        guest_name=body.name.strip(),
        guest_phone=body.phone.strip(),
        guest_email=settings.admin_email or "nampack@yandex.ru",
        delivery_address="Индивидуальный запрос",
        delivery_cost=Decimal("0.00"),
        pvz_code=None,
        payment_method="invoice",
        comment=f"ИНДИВИДУАЛЬНЫЙ ЗАПРОС: {body.message.strip()}" if body.message else "Индивидуальный запрос на расчёт тиража",
        company_name=body.company.strip() if body.company else None,
        delivery_type="custom_calc",
        status=OrderStatus.pending,
        total_amount=Decimal("0.00"),
    )
    db.add(order)
    await db.commit()

    inquiry_data = {
        "order_id": req_id,
        "customer_name": body.name.strip(),
        "customer_phone": body.phone.strip(),
        "customer_email": settings.admin_email or "nampack@yandex.ru",
        "company_name": body.company.strip() if body.company else "",
        "delivery_address": "Индивидуальный запрос",
        "delivery_cost": 0.0,
        "payment_method": "invoice",
        "delivery_type": "custom_calc",
        "comment": body.message.strip() if body.message else "Индивидуальный запрос на расчёт",
        "items": [],
        "cart_total": 0.0,
        "total_amount": 0.0,
    }

    background_tasks.add_task(_notify_inquiry, inquiry_data)

    return {
        "status": "success",
        "message": "Запрос успешно принят! Менеджер НАМПАК свяжется с вами для расчета.",
        "order_id": req_id,
    }
