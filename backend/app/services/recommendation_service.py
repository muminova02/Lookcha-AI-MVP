"""Recommendation domain service (MongoDB-backed).

Joins recommendation metadata (match score + section) stored in the
`recommendations` collection with full product records so the API returns
ready-to-render `RecommendedProduct` items.
"""

from __future__ import annotations

from app.db.mongodb import get_database
from app.schemas.product import RecommendationsResponse, RecommendedProduct
from app.services.product_service import get_product

_SECTION_ORDER = ["sizga_mos", "yoqishi_mumkin", "shu_dokondan", "oxshash"]


async def get_recommendations(product_id: str) -> RecommendationsResponse:
    db = get_database()
    block = (
        await db.recommendations.find_one({"product_id": product_id}, {"_id": 0})
        or await db.recommendations.find_one({"product_id": "_default"}, {"_id": 0})
        or {}
    )

    items: list[RecommendedProduct] = []
    for entry in block.get("items", []):
        product = await get_product(entry.get("product_id", ""))
        if product is None:
            continue  # skip stale references gracefully
        items.append(
            RecommendedProduct(
                **product.model_dump(),
                match_score=entry.get("match_score", 0),
                section=entry.get("section", "yoqishi_mumkin"),
            )
        )

    present_sections = [s for s in _SECTION_ORDER if any(i.section == s for i in items)]

    return RecommendationsResponse(
        product_id=product_id,
        stylist_advice=block.get("stylist_advice", ""),
        sections=present_sections,
        products=items,
    )
