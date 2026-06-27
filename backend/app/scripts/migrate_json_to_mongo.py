"""Optional migration: import legacy app/data/*.json into MongoDB.

Run:  python -m app.scripts.migrate_json_to_mongo

Reads the old JSON seed files and inserts them into MongoDB, mapping the old
product shape onto the new media/criteria model. Legacy products get
`display_image_url` from `image_url`, an empty `tryon_reference_image_url`, and
`ai_ready_status = needs_review` (so they are caught by support before AI).
"""

from __future__ import annotations

import asyncio

from app.db.mongodb import (
    close_mongo_connection,
    connect_to_mongo,
    ensure_indexes,
    get_database,
)
from app.schemas.product import Product, QualityControl
from app.storage import json_store


def _migrate_product(row: dict) -> dict:
    product = Product(
        **{
            **row,
            "merchant_id": row.get("merchant_id", "moda-uz"),
            "display_image_url": row.get("display_image_url") or row.get("image_url"),
            "quality_control": QualityControl(
                ai_ready_status="needs_review",
                support_note=(
                    "JSON’dan ko‘chirildi. Try-on reference rasm va kriteriyalarni to‘ldiring."
                ),
            ),
        }
    )
    return product.model_dump(mode="json")


async def migrate() -> None:
    await connect_to_mongo()
    db = get_database()

    products = [_migrate_product(r) for r in json_store.read_list("products")]
    if products:
        await db.products.delete_many({})
        await db.products.insert_many(products)

    raw_recs = json_store.read_json("recommendations", default={}) or {}
    recs = [{"product_id": pid, **block} for pid, block in raw_recs.items()]
    if recs:
        await db.recommendations.delete_many({})
        await db.recommendations.insert_many(recs)

    dashboard = json_store.read_json("merchant", default=None)
    if dashboard:
        await db.merchant_dashboard.delete_many({})
        await db.merchant_dashboard.insert_one(dashboard)

    qr_link = json_store.read_json("qr_link", default=None)
    if qr_link:
        await db.qr_links.delete_many({})
        await db.qr_links.insert_one(qr_link)

    leads = json_store.read_list("leads")
    if leads:
        await db.leads.insert_many(leads)

    orders = json_store.read_list("orders")
    if orders:
        await db.orders.insert_many(orders)

    await ensure_indexes()
    print(
        f"Migrated -> products={len(products)}, recommendations={len(recs)}, "
        f"leads={len(leads)}, orders={len(orders)}"
    )
    await close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(migrate())
