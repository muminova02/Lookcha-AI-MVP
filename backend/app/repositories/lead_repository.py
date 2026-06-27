"""Lead persistence (MongoDB `leads` collection)."""

from __future__ import annotations

from app.db.mongodb import get_database


async def create(doc: dict) -> None:
    await get_database().leads.insert_one(dict(doc))
