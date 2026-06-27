"""Product domain service."""

from __future__ import annotations

from app.schemas.product import Product
from app.storage import json_store


def list_products() -> list[Product]:
    return [Product(**row) for row in json_store.read_list("products")]


def get_product(product_id: str) -> Product | None:
    for row in json_store.read_list("products"):
        if row.get("id") == product_id:
            return Product(**row)
    return None
