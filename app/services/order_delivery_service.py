"""
Order delivery automation workflow — ЗАГЛУШКА (НАМПАК).

СДЭК и ЮKassa отключены в пользу работы через менеджера.
Этот модуль сохранён как безопасная заглушка, чтобы не ломать импорты
из других частей кода. Все функции-заглушки ничего не делают и возвращают
пустой успешный результат.
"""
from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)


def _build_order_dict_for_email(order: Any) -> dict[str, Any]:
    """Строит словарь для email-уведомлений (используется только внутри модуля)."""
    items = getattr(order, "items", [])
    return {
        "order_id":        order.order_id,
        "customer_name":   order.guest_name,
        "customer_phone":  order.guest_phone,
        "customer_email":  order.guest_email,
        "delivery_address": order.delivery_address,
        "delivery_cost":   float(getattr(order, "delivery_cost", 0) or 0),
        "pvz_code":        getattr(order, "pvz_code", None),
        "payment_method":  order.payment_method,
        "comment":         order.comment,
        "cdek_number":     getattr(order, "cdek_number", None),
        "items": [
            {
                "name":     it.product_name,
                "price":    float(it.product_price),
                "quantity": it.quantity,
                "subtotal": float(it.product_price * it.quantity),
            }
            for it in items
        ],
        "total_amount": float(order.total_amount),
    }


async def process_cdek_order_for_order(
    order_id_or_db_id: int | str,
    mark_shipped_if_in_production: bool = False,
) -> dict[str, Any]:
    """
    ЗАГЛУШКА: СДЭК отключён. Всегда возвращает {'success': False, 'error': 'СДЭК отключён'}.
    """
    logger.info(
        "process_cdek_order_for_order вызван для %s, но СДЭК отключён (режим менеджера).",
        order_id_or_db_id,
    )
    return {"success": False, "error": "СДЭК отключён — работа через менеджера"}


async def handle_paid_order_background(order_id: str, is_all_in_stock: bool) -> None:
    """
    ЗАГЛУШКА: ЮKassa вебхуки отключены.
    """
    logger.info(
        "handle_paid_order_background вызван для %s, но платёжный вебхук отключён.",
        order_id,
    )


def validate_cdek_sender_data(site_requisites: dict[str, str]) -> tuple[bool, str]:
    """ЗАГЛУШКА: СДЭК отключён."""
    return False, "СДЭК отключён — работа через менеджера"
