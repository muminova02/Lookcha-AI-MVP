"""Product routes."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.schemas.product import Product
from app.services import product_service

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[Product])
async def list_products() -> list[Product]:
    return product_service.list_products()


@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str) -> Product:
    product = product_service.get_product(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")
    return product
