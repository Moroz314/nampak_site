"""
Модуль расчёта многоуровневых оптовых цен НАМПАК в зависимости от объёма тиража.
"""
from decimal import Decimal
from typing import Any


def get_unit_price_for_qty(product: Any, quantity: int) -> Decimal:
    """
    Возвращает актуальную цену за 1 единицу товара с учётом ценовых порогов (price_tiers).

    Алгоритм:
    1. Если у товара нет price_tiers или список пуст — возвращается базовая product.price.
    2. Если price_tiers задан:
       - Сортируются уровни по min_qty по возрастанию.
       - Находится уровень с максимальным min_qty, который <= quantity.
       - Если quantity меньше самого минимального порога — берётся цена первого уровня.
    """
    base_price = Decimal(str(product.price if hasattr(product, "price") else getattr(product, "price", 0)))

    tiers = getattr(product, "price_tiers", None)
    if not tiers or not isinstance(tiers, list):
        return base_price

    valid_tiers = []
    for item in tiers:
        if isinstance(item, dict) and "min_qty" in item and "price" in item:
            try:
                min_qty = int(item["min_qty"])
                price = Decimal(str(item["price"]))
                if min_qty >= 1 and price >= 0:
                    valid_tiers.append({"min_qty": min_qty, "price": price})
            except (ValueError, TypeError):
                continue

    if not valid_tiers:
        return base_price

    # Сортировка по возрастанию порога
    valid_tiers.sort(key=lambda t: t["min_qty"])

    qty = max(1, int(quantity))
    applicable_price = valid_tiers[0]["price"]

    for tier in valid_tiers:
        if tier["min_qty"] <= qty:
            applicable_price = tier["price"]
        else:
            break

    return applicable_price
