"""Recommendation domain service.

Joins recommendation metadata (match score + section) with full product
records so the API returns ready-to-render `RecommendedProduct` items.
"""

from __future__ import annotations

from app.schemas.product import RecommendationsResponse, RecommendedProduct
from app.services.product_service import get_product
from app.storage import json_store

_SECTION_ORDER = ["sizga_mos", "yoqishi_mumkin", "shu_dokondan", "oxshash"]


def get_recommendations(product_id: str) -> RecommendationsResponse:
    data = json_store.read_json("recommendations", default={}) or {}
    block = data.get(product_id) or data.get("_default") or {}

    items: list[RecommendedProduct] = []
    for entry in block.get("items", []):
        product = get_product(entry.get("product_id", ""))
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
