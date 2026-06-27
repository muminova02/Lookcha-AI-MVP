"""Product persistence (MongoDB `products` collection)."""

from __future__ import annotations

from app.db.mongodb import get_database

_NO_ID = {"_id": 0}


async def list_products() -> list[dict]:
    cursor = get_database().products.find({}, _NO_ID)
    return [doc async for doc in cursor]


async def get_product(product_id: str) -> dict | None:
    return await get_database().products.find_one({"id": product_id}, _NO_ID)


async def exists(product_id: str) -> bool:
    count = await get_database().products.count_documents({"id": product_id}, limit=1)
    return count > 0


async def insert_product(doc: dict) -> None:
    await get_database().products.insert_one(dict(doc))


async def replace_product(product_id: str, doc: dict) -> None:
    await get_database().products.replace_one({"id": product_id}, dict(doc), upsert=True)
