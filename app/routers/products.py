import re
import sqlalchemy as sa
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Product, Review
from app.schemas import ProductListRead, ProductRead, ReviewCreate, ReviewRead

router = APIRouter()


def get_search_variants(query: str) -> list[str]:
    """Генерирует варианты поискового запроса для поиска по габаритам и тексту.
    Нормализует разделители: *, ×, латинскую x и русскую х с пробелами и без.
    """
    raw = query.strip()
    if not raw:
        return []
    variants = {raw}

    # Варианты нормализации разделителей размеров
    norm_mult = re.sub(r'[\*xXхХ×]', '×', raw)
    norm_tight = re.sub(r'\s*×\s*', '×', norm_mult)
    norm_star = re.sub(r'[\*xXхХ×]', '*', raw)
    norm_star_tight = re.sub(r'\s*\*\s*', '*', norm_star)
    norm_x = re.sub(r'[\*xXхХ×]', 'x', raw)
    norm_cyr = re.sub(r'[\*xXхХ×]', 'х', raw)

    for v in (norm_mult, norm_tight, norm_star, norm_star_tight, norm_x, norm_cyr):
        cleaned = v.strip()
        if cleaned:
            variants.add(cleaned)
    return list(variants)


@router.get(
    "/",
    response_model=list[ProductListRead],
    summary="Список товаров (с фильтрацией по категории)",
)
async def get_products(
    category_id: int | None = Query(default=None, description="ID категории для фильтрации"),
    in_stock: bool | None = Query(default=None, description="Только товары в наличии"),
    search: str | None = Query(default=None, description="Поиск по названию или описанию"),
    q: str | None = Query(default=None, description="Поиск (алиас)"),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
) -> list[Product]:
    stmt = (
        select(Product)
        .where(Product.slug != "termoetiketki-eko-v-rulonah")
        .order_by(Product.sort_order.asc(), Product.id.asc())
    )
    if category_id is not None:
        stmt = stmt.where(Product.category_id == category_id)
    if in_stock is not None:
        stmt = stmt.where(Product.in_stock == in_stock)
    search_query = search or q
    if search_query and search_query.strip():
        variants = get_search_variants(search_query)
        conditions = []
        for v in variants:
            term = f"%{v}%"
            conditions.extend([
                Product.name.ilike(term),
                Product.description.ilike(term),
                Product.dimensions_mm.ilike(term),
                Product.material_specs.ilike(term),
            ])
        stmt = stmt.where(sa.or_(*conditions))
    stmt = stmt.limit(limit).offset(offset)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post(
    "/{product_id}/reviews",
    response_model=ReviewRead,
    status_code=status.HTTP_201_CREATED,
    summary="Добавить отзыв к товару",
)
async def create_review(
    product_id: int,
    body: ReviewCreate,
    db: AsyncSession = Depends(get_db),
) -> Review:
    product = await db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Товар не найден")

    review = Review(product_id=product_id, **body.model_dump())
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review


@router.get(
    "/{slug}",
    response_model=ProductRead,
    summary="Товар по slug",
)
async def get_product_by_slug(slug: str, db: AsyncSession = Depends(get_db)) -> Product:
    """Возвращает полную карточку товара с вложенной категорией."""
    result = await db.execute(select(Product).where(Product.slug == slug))
    product = result.scalar_one_or_none()
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Товар '{slug}' не найден")
    return product
