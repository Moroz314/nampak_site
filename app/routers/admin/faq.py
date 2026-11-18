"""
Административный роутер управления разделом FAQ (Частые вопросы).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models import AdminUser, FaqItem
from app.schemas import FaqCreate, FaqRead, FaqReorderRequest, FaqUpdate

router = APIRouter()


@router.get("/", response_model=list[FaqRead], summary="Получить все вопросы FAQ (включая скрытые)")
async def get_all_faq(
    _admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> list[FaqRead]:
    stmt = select(FaqItem).order_by(FaqItem.sort_order.asc(), FaqItem.id.asc())
    result = await db.execute(stmt)
    items = result.scalars().all()
    return [FaqRead.model_validate(it) for it in items]


@router.post("/", response_model=FaqRead, status_code=status.HTTP_201_CREATED, summary="Создать вопрос FAQ")
async def create_faq(
    body: FaqCreate,
    _admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> FaqRead:
    item = FaqItem(
        question=body.question.strip(),
        answer=body.answer.strip(),
        sort_order=body.sort_order,
        is_active=body.is_active,
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return FaqRead.model_validate(item)


@router.put("/{faq_id}", response_model=FaqRead, summary="Обновить вопрос FAQ")
async def update_faq(
    faq_id: int,
    body: FaqUpdate,
    _admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> FaqRead:
    result = await db.execute(select(FaqItem).where(FaqItem.id == faq_id))
    item = result.scalar_one_or_none()
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вопрос FAQ не найден")

    if body.question is not None:
        item.question = body.question.strip()
    if body.answer is not None:
        item.answer = body.answer.strip()
    if body.sort_order is not None:
        item.sort_order = body.sort_order
    if body.is_active is not None:
        item.is_active = body.is_active

    await db.commit()
    await db.refresh(item)
    return FaqRead.model_validate(item)


@router.delete("/{faq_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Удалить вопрос FAQ")
async def delete_faq(
    faq_id: int,
    _admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(FaqItem).where(FaqItem.id == faq_id))
    item = result.scalar_one_or_none()
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вопрос FAQ не найден")

    await db.delete(item)
    await db.commit()
    return None


@router.patch("/reorder", status_code=status.HTTP_200_OK, summary="Изменить порядок вопросов FAQ")
async def reorder_faq(
    body: FaqReorderRequest,
    _admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    for entry in body.items:
        result = await db.execute(select(FaqItem).where(FaqItem.id == entry.id))
        item = result.scalar_one_or_none()
        if item is not None:
            item.sort_order = entry.sort_order

    await db.commit()
    return {"status": "ok"}
