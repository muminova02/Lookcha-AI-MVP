"""Try-on flow schemas: profile upload, generate request, and result."""

from __future__ import annotations

from pydantic import BaseModel, Field

from app.schemas.product import Product, RecommendedProduct


class ProfileData(BaseModel):
    """Body/style info submitted with the full-body photo."""

    height_cm: int = Field(..., ge=80, le=250)
    weight_kg: int = Field(..., ge=25, le=250)
    age_range: str
    usual_size: str
    body_type: str
    style: str
    occasion: str


class ProfileUploadResponse(BaseModel):
    profile_id: str
    photo_url: str


class TryOnGenerateRequest(BaseModel):
    product_id: str
    profile_id: str


class AIGeneration(BaseModel):
    """Raw output of an AI adapter (provider-agnostic)."""

    tryon_image_url: str
    match_score: int = Field(..., ge=0, le=100)
    size_recommendation: str
    color_match: str
    advice: str
    # Which provider actually produced the image ("nanobanana" | "mock").
    # Lets the caller record a job as success vs. fallback without changing
    # the public response contract.
    source: str = "mock"


class TryOnResult(BaseModel):
    """Full try-on response returned to the client.

    `status` and `warning` are additive (optional) fields; the existing
    frontend ignores unknown fields, so the contract stays compatible.
    """

    tryon_image_url: str
    match_score: int = Field(..., ge=0, le=100)
    size_recommendation: str
    color_match: str
    advice: str
    product: Product
    recommended_products: list[RecommendedProduct]
    status: str = "success"
    warning: str | None = None
