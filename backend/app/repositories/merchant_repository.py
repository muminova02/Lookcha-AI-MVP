"""Merchant persistence (MongoDB `merchant_dashboard` + `qr_links`)."""

from __future__ import annotations

from app.db.mongodb import get_database

_NO_ID = {"_id": 0}


async def get_dashboard() -> dict | None:
    return await get_database().merchant_dashboard.find_one({}, _NO_ID)


async def get_qr_link() -> dict | None:
    return await get_database().qr_links.find_one({}, _NO_ID)
