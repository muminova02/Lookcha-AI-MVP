"""Try-on orchestration service.

Handles profile persistence and ties together the product, the AI adapter,
and recommendations into a single `TryOnResult`.
"""

from __future__ import annotations

import uuid

from app.schemas.tryon import ProfileData, TryOnResult
from app.services.ai.factory import get_ai_adapter
from app.services.product_service import get_product
from app.services.recommendation_service import get_recommendations
from app.storage import json_store


class ProductNotFoundError(Exception):
    pass


class ProfileNotFoundError(Exception):
    pass


def save_profile(profile: ProfileData, photo_url: str) -> str:
    """Persist a profile and return its generated id."""
    profile_id = f"prof_{uuid.uuid4().hex[:12]}"
    record = {"profile_id": profile_id, "photo_url": photo_url, **profile.model_dump()}
    json_store.append_item("profiles", record)
    return profile_id


def _get_profile_row(profile_id: str) -> dict:
    for row in json_store.read_list("profiles"):
        if row.get("profile_id") == profile_id:
            return row
    raise ProfileNotFoundError(profile_id)


async def generate_tryon(product_id: str, profile_id: str) -> TryOnResult:
    product = get_product(product_id)
    if product is None:
        raise ProductNotFoundError(product_id)

    row = _get_profile_row(profile_id)
    profile = ProfileData(**{k: row[k] for k in ProfileData.model_fields if k in row})
    photo_url = row.get("photo_url")

    adapter = get_ai_adapter()
    generation = await adapter.generate(product, profile, photo_url)

    recommendations = get_recommendations(product_id)

    return TryOnResult(
        **generation.model_dump(),
        product=product,
        recommended_products=recommendations.products,
    )
