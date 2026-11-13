"""
POST /api/checkout — Оформление гостевого заказа (НАМПАК).

Работает без интеграции ЮKassa/СДЭК: заказ сразу создаётся в статусе
`pending` («Новая заявка»), корзина очищается, администратору и клиенту
отправляется email-уведомление. Менеджер связывается с клиентом для
согласования объёма, доставки и выставления счёта.
"""
import random
import string
from decimal import Decimal

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Order, OrderItem, OrderStatus
from app.routers.cart import _build_cart
from app.schemas import CheckoutRequest, CheckoutResponse
from app.services.email_service import send_new_order_email

router = APIRouter()


def _gen_order_id() -> str:
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f"ORD-{suffix}"


@router.post("/", response_model=CheckoutResponse, summary="Оформить заявку (НАМПАК)")
async def checkout(
    body:             CheckoutRequest,
    request:          Request,
    background_tasks: BackgroundTasks,
    db:               AsyncSession = Depends(get_db),
) -> CheckoutResponse:
    redis = request.app.state.redis

    # 1. Получить корзину из Redis
    cart = await _build_cart(body.session_id, redis, db)
    if not cart.items:
        raise HTTPException(status_code=400, detail="Корзина пуста")

    # 2. Сгенерировать уникальный order_id
    order_id = _gen_order_id()

    delivery_cost = body.delivery_cost if body.delivery_cost is not None else Decimal("0.00")
    total_with_delivery = cart.total + delivery_cost

    # 3. Создать заказ в БД (сразу в статусе pending — «Новая заявка»)
    order = Order(
        order_id         = order_id,
        guest_name       = body.customer_name,
        guest_phone      = body.customer_phone,
        guest_email      = body.customer_email,
        delivery_address = body.delivery_address or "",
        delivery_cost    = delivery_cost,
        pvz_code         = body.pvz_code,
        payment_method   = body.payment_method,
        comment          = body.comment,
        company_name     = body.company_name,
        delivery_type    = body.delivery_type,
        status           = OrderStatus.pending,
        total_amount     = total_with_delivery,
    )
    db.add(order)
    await db.flush()  # получаем order.id для FK в OrderItem

    # 4. Создать позиции заказа (снимок данных на момент заказа)
    for item in cart.items:
        order_item = OrderItem(
            order_id      = order.id,
            product_id    = item.product_id,
            product_name  = item.name,
            product_price = item.price,
            quantity      = item.quantity,
        )
        db.add(order_item)

    await db.commit()

    # 5. Фоновая отправка email-уведомления администратору и клиенту
    order_data = {
        "order_id":        order_id,
        "customer_name":   body.customer_name,
        "customer_phone":  body.customer_phone,
        "customer_email":  body.customer_email,
        "delivery_address": body.delivery_address or "",
        "delivery_cost":   float(delivery_cost),
        "pvz_code":        body.pvz_code,
        "payment_method":  body.payment_method,
        "company_name":    body.company_name,
        "delivery_type":   body.delivery_type,
        "comment":         body.comment,
        "items": [
            {
                "name":     item.name,
                "price":    float(item.price),
                "quantity": item.quantity,
                "subtotal": float(item.price * item.quantity),
            }
            for item in cart.items
        ],
        "cart_total":    float(cart.total),
        "total_amount":  float(total_with_delivery),
    }
    background_tasks.add_task(send_new_order_email, order_data)

    # 6. Очистить корзину в Redis
    await redis.delete(f"cart:{body.session_id}")

    return CheckoutResponse(
        status   = "created",
        message  = (
            f"Заявка {order_id} принята. Менеджер НАМПАК свяжется с вами "
            "для согласования объёма, доставки и выставления счёта."
        ),
        order_id    = order_id,
        payment_url = None,
    )
