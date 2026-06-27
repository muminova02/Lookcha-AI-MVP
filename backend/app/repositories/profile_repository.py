"""Profile persistence (MongoDB `profiles` collection)."""

from __future__ import annotations

from app.db.mongodb import get_database

_NO_ID = {"_id": 0}


async def create(doc: dict) -> None:
    await get_database().profiles.insert_one(dict(doc))


async def get(profile_id: str) -> dict | None:
    return await get_database().profiles.find_one({"profile_id": profile_id}, _NO_ID)
