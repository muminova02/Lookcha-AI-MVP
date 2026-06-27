"""Recommendation routes."""

from __future__ import annotations

from fastapi import APIRouter, Query

from app.schemas.product import RecommendationsResponse
from app.services import recommendation_service

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("", response_model=RecommendationsResponse)
async def get_recommendations(
    product_id: str = Query(..., description="Asosiy mahsulot id"),
) -> RecommendationsResponse:
    return await recommendation_service.get_recommendations(product_id)
