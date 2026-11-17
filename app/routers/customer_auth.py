"""
Роутер авторизации и личного кабинета покупателя (НАМПАК).

Префикс: /api/user
"""
from decimal import Decimal

import sqlalchemy as sa
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import (
    create_customer_token,
    get_current_user,
    hash_password,
    verify_password,
)
from app.models import Order, Product, User
from app.routers.cart import CART_TTL_SECONDS, _build_cart
from app.schemas import (
    CartRead,
    CustomerLoginRequest,
    CustomerProfileRead,
    CustomerProfileUpdate,
    CustomerRegisterRequest,
    CustomerTokenResponse,
    OrderRead,
)

router = APIRouter()


@router.post(
    "/register",
    response_model=CustomerTokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Регистрация нового покупателя",
)
async def register(
    body: CustomerRegisterRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> CustomerTokenResponse:
    email_clean = body.email.strip().lower()

    # Проверка уникальности email
    existing = await db.execute(select(User).where(sa.func.lower(User.email) == email_clean))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким email уже зарегистрирован",
        )

    user = User(
        email=email_clean,
        hashed_password=hash_password(body.password),
        full_name=body.full_name.strip(),
        phone=body.phone.strip() if body.phone and body.phone.strip() else None,
        company_name=body.company_name.strip() if body.company_name and body.company_name.strip() else None,
        inn=body.inn.strip() if body.inn and body.inn.strip() else None,
        edo_operator=body.edo_operator.strip() if body.edo_operator and body.edo_operator.strip() else None,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Если была гостевая сессия корзины — переносим товары в аккаунт
    if body.session_id:
        redis = request.app.state.redis
        guest_key = f"cart:{body.session_id}"
        user_key = f"cart:user:{user.id}"
        guest_items = await redis.hgetall(guest_key)
        if guest_items:
            for pid_str, qty_str in guest_items.items():
                try:
                    await redis.hincrby(user_key, pid_str, int(qty_str))
                except ValueError:
                    pass
            await redis.delete(guest_key)
            await redis.expire(user_key, CART_TTL_SECONDS)

    token = create_customer_token(user.id, user.email)
    return CustomerTokenResponse(
        access_token=token,
        token_type="bearer",
        user=CustomerProfileRead.model_validate(user),
    )


@router.post(
    "/login",
    response_model=CustomerTokenResponse,
    summary="Вход покупателя в личный кабинет",
)
async def login(
    body: CustomerLoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> CustomerTokenResponse:
    email_clean = body.email.strip().lower()

    result = await db.execute(select(User).where(sa.func.lower(User.email) == email_clean))
    user = result.scalar_one_or_none()

    if user is None or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Аккаунт заблокирован. Обратитесь к менеджеру НАМПАК.",
        )

    # Слияние гостевой корзины при входе
    if body.session_id:
        redis = request.app.state.redis
        guest_key = f"cart:{body.session_id}"
        user_key = f"cart:user:{user.id}"
        guest_items = await redis.hgetall(guest_key)
        if guest_items:
            for pid_str, qty_str in guest_items.items():
                try:
                    await redis.hincrby(user_key, pid_str, int(qty_str))
                except ValueError:
                    pass
            await redis.delete(guest_key)
            await redis.expire(user_key, CART_TTL_SECONDS)

    token = create_customer_token(user.id, user.email)
    return CustomerTokenResponse(
        access_token=token,
        token_type="bearer",
        user=CustomerProfileRead.model_validate(user),
    )


@router.get(
    "/me",
    response_model=CustomerProfileRead,
    summary="Профиль текущего покупателя",
)
async def get_profile(
    user: User = Depends(get_current_user),
) -> CustomerProfileRead:
    return CustomerProfileRead.model_validate(user)


@router.patch(
    "/me",
    response_model=CustomerProfileRead,
    summary="Обновление данных профиля и смена пароля",
)
async def update_profile(
    body: CustomerProfileUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CustomerProfileRead:
    # Смена пароля
    if body.new_password:
        if not body.current_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Для смены пароля необходимо указать текущий пароль",
            )
        if not verify_password(body.current_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный текущий пароль",
            )
        user.hashed_password = hash_password(body.new_password)

    if body.full_name is not None and body.full_name.strip():
        user.full_name = body.full_name.strip()
    if body.phone is not None:
        user.phone = body.phone.strip() if body.phone.strip() else None
    if body.company_name is not None:
        user.company_name = body.company_name.strip() if body.company_name.strip() else None
    if body.inn is not None:
        user.inn = body.inn.strip() if body.inn.strip() else None
    if body.edo_operator is not None:
        user.edo_operator = body.edo_operator.strip() if body.edo_operator.strip() else None
    if body.default_delivery_address is not None:
        user.default_delivery_address = (
            body.default_delivery_address.strip() if body.default_delivery_address.strip() else None
        )

    await db.commit()
    await db.refresh(user)
    return CustomerProfileRead.model_validate(user)


@router.get(
    "/orders",
    response_model=list[OrderRead],
    summary="История заказов текущего покупателя",
)
async def get_my_orders(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[OrderRead]:
    # Заказы, привязанные по user_id, либо созданные ранее как гость с таким же email
    stmt = (
        select(Order)
        .where(
            sa.or_(
                Order.user_id == user.id,
                sa.func.lower(Order.guest_email) == user.email.lower(),
            )
        )
        .order_by(Order.created_at.desc())
    )
    result = await db.execute(stmt)
    orders = result.scalars().all()
    return [OrderRead.model_validate(o) for o in orders]


@router.post(
    "/orders/{order_id}/repeat",
    response_model=CartRead,
    summary="Повторить заказ (добавить товары из прошлого заказа в корзину)",
)
async def repeat_order(
    order_id: str,
    request: Request,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CartRead:
    stmt = select(Order).where(
        Order.order_id == order_id,
        sa.or_(
            Order.user_id == user.id,
            sa.func.lower(Order.guest_email) == user.email.lower(),
        ),
    )
    result = await db.execute(stmt)
    order = result.scalar_one_or_none()
    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден",
        )

    redis = request.app.state.redis
    user_key = f"cart:user:{user.id}"

    # Проверяем наличие каждого товара в каталоге и добавляем в корзину
    added_count = 0
    for item in order.items:
        if item.product_id:
            prod_res = await db.execute(select(Product).where(Product.id == item.product_id))
            prod = prod_res.scalar_one_or_none()
            if prod is not None:
                await redis.hincrby(user_key, str(item.product_id), item.quantity)
                added_count += 1

    if added_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Товары из этого заказа больше не доступны в каталоге",
        )

    await redis.expire(user_key, CART_TTL_SECONDS)
    return await _build_cart(session_id="", redis=redis, db=db, cart_key=user_key)
