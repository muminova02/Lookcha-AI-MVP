"""Try-on job persistence (MongoDB `tryon_jobs` collection)."""

from __future__ import annotations

from typing import Any

from app.db.mongodb import get_database

_NO_ID = {"_id": 0}


async def create_job(doc: dict) -> None:
    await get_database().tryon_jobs.insert_one(dict(doc))


async def finish_job(job_id: str, updates: dict[str, Any]) -> None:
    await get_database().tryon_jobs.update_one({"job_id": job_id}, {"$set": updates})


async def get_job(job_id: str) -> dict | None:
    return await get_database().tryon_jobs.find_one({"job_id": job_id}, _NO_ID)
