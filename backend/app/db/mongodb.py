"""MongoDB connection layer (Motor async driver).

A single shared `AsyncIOMotorClient` is created lazily. Motor does not open a
socket until the first operation, so `connect_to_mongo()` is cheap and the app
boots even if MongoDB is temporarily unreachable; index creation is wrapped so
a missing server only logs a warning instead of crashing startup.
"""

from __future__ import annotations

import logging

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings

logger = logging.getLogger("lookcha.db")

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None

# (collection, field, unique)
_INDEXES: tuple[tuple[str, str, bool], ...] = (
    ("products", "id", True),
    ("profiles", "profile_id", True),
    ("tryon_jobs", "job_id", True),
    ("orders", "id", True),
    ("leads", "id", True),
    ("recommendations", "product_id", True),
)


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(
            settings.mongodb_uri,
            serverSelectionTimeoutMS=5000,
            uuidRepresentation="standard",
        )
    return _client


def get_database() -> AsyncIOMotorDatabase:
    global _db
    if _db is None:
        _db = get_client()[settings.mongodb_db]
    return _db


async def connect_to_mongo() -> None:
    get_database()
    logger.info("MongoDB client initialized (db=%s)", settings.mongodb_db)


async def close_mongo_connection() -> None:
    global _client, _db
    if _client is not None:
        _client.close()
    _client = None
    _db = None
    logger.info("MongoDB client closed")


async def ensure_indexes() -> None:
    db = get_database()
    try:
        for collection, field, unique in _INDEXES:
            await db[collection].create_index(field, unique=unique)
        logger.info("MongoDB indexes ensured")
    except Exception as exc:  # noqa: BLE001 - never block startup on index setup
        logger.warning(
            "Could not create MongoDB indexes (is MongoDB running?): %s", exc
        )
