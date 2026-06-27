"""Order routes."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.schemas.order import Order, OrderCreate
from app.services import product_service
from app.storage import json_store
from app.storage.json_store import StorageError

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=Order, status_code=201)
async def create_order(payload: OrderCreate) -> Order:
    if product_service.get_product(payload.product_id) is None:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")

    order = Order(
        id=f"ord_{uuid.uuid4().hex[:12]}",
        created_at=datetime.now(timezone.utc),
        **payload.model_dump(),
    )
    try:
        json_store.append_item("orders", order.model_dump(mode="json"))
    except StorageError as exc:
        raise HTTPException(status_code=500, detail="Buyurtmani saqlashda xatolik.") from exc
    return order
