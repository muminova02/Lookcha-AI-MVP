"""Order persistence (MongoDB `orders` collection)."""

from __future__ import annotations

from app.db.mongodb import get_database


async def create(doc: dict) -> None:
    await get_database().orders.insert_one(dict(doc))
