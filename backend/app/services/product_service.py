"""Product domain service (MongoDB-backed)."""

from __future__ import annotations

from datetime import datetime, timezone

from app.repositories import product_repository
from app.schemas.product import Product, ProductCreate, ProductQualityResult, ProductUpdate
from app.services.product_quality_service import (
    apply_quality_status,
    validate_product_criteria,
)


class ProductExistsError(Exception):
    pass


class ProductNotReadyError(Exception):
    """Raised when trying to approve a product with missing criteria."""

    def __init__(self, result: ProductQualityResult) -> None:
        super().__init__(result.support_note)
        self.result = result


async def list_products() -> list[Product]:
    return [Product(**row) for row in await product_repository.list_products()]


async def get_product(product_id: str) -> Product | None:
    row = await product_repository.get_product(product_id)
    return Product(**row) if row else None


async def create_product(payload: ProductCreate) -> Product:
    if await product_repository.exists(payload.id):
        raise ProductExistsError(payload.id)
    product = apply_quality_status(Product(**payload.model_dump()))
    await product_repository.insert_product(product.model_dump(mode="json"))
    return product


async def update_product(product_id: str, payload: ProductUpdate) -> Product | None:
    existing = await get_product(product_id)
    if existing is None:
        return None

    data = existing.model_dump()
    updates = payload.model_dump(exclude_unset=True)

    criteria_update = updates.pop("product_criteria", None)
    if criteria_update is not None:
        data["product_criteria"] = {**data["product_criteria"], **criteria_update}
    data.update(updates)

    product = apply_quality_status(Product(**data))
    await product_repository.replace_product(product_id, product.model_dump(mode="json"))
    return product


async def validate_product(product_id: str) -> ProductQualityResult | None:
    product = await get_product(product_id)
    if product is None:
        return None
    return validate_product_criteria(product)


async def approve_product(product_id: str, reviewer: str = "support") -> Product | None:
    product = await get_product(product_id)
    if product is None:
        return None

    result = validate_product_criteria(product)
    if result.missing_fields:
        raise ProductNotReadyError(result)

    qc = product.quality_control
    qc.ai_ready_status = "approved"
    qc.missing_fields = []
    qc.support_note = "AI try-on uchun tasdiqlangan."
    qc.reviewed_by = reviewer
    qc.reviewed_at = datetime.now(timezone.utc).isoformat()

    await product_repository.replace_product(product_id, product.model_dump(mode="json"))
    return product


async def set_needs_review(
    product_id: str, note: str | None = None, reviewer: str = "support"
) -> Product | None:
    product = await get_product(product_id)
    if product is None:
        return None

    qc = product.quality_control
    qc.ai_ready_status = "needs_review"
    qc.reviewed_by = reviewer
    qc.reviewed_at = datetime.now(timezone.utc).isoformat()
    if note:
        qc.support_note = note

    await product_repository.replace_product(product_id, product.model_dump(mode="json"))
    return product
