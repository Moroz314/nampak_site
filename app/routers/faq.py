"""
Публичный роутер FAQ: список частых вопросов и ответов для главной страницы.
"""
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import FaqItem
from app.schemas import FaqRead

router = APIRouter()


@router.get("/", response_model=list[FaqRead], summary="Получить активные вопросы FAQ")
async def get_public_faq(
    db: AsyncSession = Depends(get_db),
) -> list[FaqRead]:
    stmt = (
        select(FaqItem)
        .where(FaqItem.is_active.is_(True))
        .order_by(FaqItem.sort_order.asc(), FaqItem.id.asc())
    )
    result = await db.execute(stmt)
    items = result.scalars().all()
    return [FaqRead.model_validate(it) for it in items]
