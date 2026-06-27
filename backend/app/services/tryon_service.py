"""Try-on orchestration service (MongoDB-backed).

Responsibilities:
- persist uploaded profiles (incl. a public photo URL for external APIs),
- gate AI generation behind product quality/approval,
- record an auditable `tryon_jobs` entry for every attempt,
- compose the `TryOnResult` returned to the frontend (unchanged contract).
"""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone

from app.config import settings
from app.repositories import profile_repository, tryon_repository
from app.schemas.tryon import ProfileData, TryOnResult
from app.services import product_service, recommendation_service
from app.services.advice_service import build_ai_advice
from app.services.ai.factory import get_ai_adapter
from app.services.ai.mock_adapter import MockAITryOn
from app.services.product_quality_service import validate_product_for_tryon

logger = logging.getLogger("lookcha.tryon")


class ProductNotFoundError(Exception):
    pass


class ProfileNotFoundError(Exception):
    pass


def _now() -> datetime:
    return datetime.now(timezone.utc)


async def save_profile(
    profile: ProfileData, photo_url: str, public_photo_url: str | None
) -> str:
    profile_id = f"prof_{uuid.uuid4().hex[:12]}"
    record = {
        "profile_id": profile_id,
        "photo_url": photo_url,
        "public_photo_url": public_photo_url,
        "created_at": _now().isoformat(),
        **profile.model_dump(),
    }
    await profile_repository.create(record)
    return profile_id


async def generate_tryon(product_id: str, profile_id: str) -> TryOnResult:
    product = await product_service.get_product(product_id)
    if product is None:
        raise ProductNotFoundError(product_id)

    profile_doc = await profile_repository.get(profile_id)
    if profile_doc is None:
        raise ProfileNotFoundError(profile_id)

    profile = ProfileData(
        **{k: profile_doc[k] for k in ProfileData.model_fields if k in profile_doc}
    )
    public_photo_url = profile_doc.get("public_photo_url")

    recommendations = await recommendation_service.get_recommendations(product_id)
    quality = validate_product_for_tryon(product)
    job_id = f"job_{uuid.uuid4().hex[:12]}"

    # --- Product not AI-ready: skip NanoBanana, return safe fallback --------
    if not quality.is_ready:
        logger.warning(
            "Try-on skipped (product %s not AI-ready): %s",
            product_id,
            quality.support_note,
        )
        generation = await MockAITryOn().generate(product, profile, public_photo_url)
        advice = build_ai_advice(product, profile, generation.match_score)
        await tryon_repository.create_job(
            {
                "job_id": job_id,
                "product_id": product_id,
                "profile_id": profile_id,
                "provider": "none",
                "status": "skipped_needs_review",
                "input_image_urls": [],
                "result_image_url": generation.tryon_image_url,
                "match_score": generation.match_score,
                "created_at": _now().isoformat(),
                "finished_at": _now().isoformat(),
                "error_message": quality.support_note,
            }
        )
        return TryOnResult(
            tryon_image_url=generation.tryon_image_url,
            match_score=generation.match_score,
            size_recommendation=generation.size_recommendation,
            color_match=generation.color_match,
            advice=advice,
            product=product,
            recommended_products=recommendations.products,
            status="skipped_needs_review",
            warning=quality.support_note,
        )

    # --- AI-ready: only the approved tryon_reference image is sent ----------
    provider = (settings.ai_provider or "mock").lower()
    adapter = get_ai_adapter()
    input_urls = [u for u in (public_photo_url, product.tryon_reference_image_url) if u]

    await tryon_repository.create_job(
        {
            "job_id": job_id,
            "product_id": product_id,
            "profile_id": profile_id,
            "provider": provider,
            "status": "pending",
            "input_image_urls": input_urls,
            "result_image_url": None,
            "match_score": None,
            "created_at": _now().isoformat(),
            "finished_at": None,
            "error_message": None,
        }
    )

    generation = await adapter.generate(product, profile, public_photo_url)
    advice = build_ai_advice(product, profile, generation.match_score)

    if provider == "nanobanana":
        status = "success" if generation.source == "nanobanana" else "fallback"
    else:
        status = "success"

    await tryon_repository.finish_job(
        job_id,
        {
            "status": status,
            "result_image_url": generation.tryon_image_url,
            "match_score": generation.match_score,
            "finished_at": _now().isoformat(),
        },
    )

    return TryOnResult(
        tryon_image_url=generation.tryon_image_url,
        match_score=generation.match_score,
        size_recommendation=generation.size_recommendation,
        color_match=generation.color_match,
        advice=advice,
        product=product,
        recommended_products=recommendations.products,
        status=status,
        warning=None,
    )
