"""
Публичные эндпоинты для проверки статуса и деталей заказа покупателем (НАМПАК).
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Order
from app.schemas import OrderStatusPublicRead

router = APIRouter()


@router.get(
    "/{order_id}/status",
    response_model=OrderStatusPublicRead,
    summary="Статус заказа (публичный)",
)
@router.get(
    "/{order_id}",
    response_model=OrderStatusPublicRead,
    summary="Детали заказа (публичный)",
)
async def get_order_status(
    order_id: str,
    db: AsyncSession = Depends(get_db),
) -> OrderStatusPublicRead:
    """
    Возвращает актуальный статус заказа и его позиции.
    Используется страницей подтверждения заказа.
    """
    stmt = (
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.order_id == order_id)
    )
    order = (await db.execute(stmt)).scalar_one_or_none()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Заказ {order_id} не найден",
        )
    return order
