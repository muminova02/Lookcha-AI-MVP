"""Product-related schemas.

The product now carries a richer media model and quality-control metadata so
the AI try-on only ever receives an *approved* clean clothing reference image
(never a catalog/hanger/collage display image).

Backward compatibility: the legacy `image_url` / `tryon_image_url` fields are
preserved and auto-populated, so the existing frontend contract keeps working.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, model_validator

# Recommendation sections shown on the AI recommendations page.
RecommendationSection = Literal["sizga_mos", "yoqishi_mumkin", "shu_dokondan", "oxshash"]

FitType = Literal["oversize", "regular", "slim", "loose", "unknown"]
StretchLevel = Literal["none", "low", "medium", "high", "unknown"]
AiReadyStatus = Literal["approved", "needs_review", "rejected"]


class ProductCriteria(BaseModel):
    size_chart_available: bool = False
    available_sizes: list[str] = Field(default_factory=list)
    fit_type: FitType = "unknown"
    fabric_type: str | None = None
    fabric_composition: str | None = None
    stretch_level: StretchLevel = "unknown"
    length_info: str | None = None
    silhouette: str | None = None
    real_color_confirmed: bool = False
    care_info: str | None = None
    model_height_cm: int | None = None
    model_wearing_size: str | None = None


class QualityControl(BaseModel):
    ai_ready_status: AiReadyStatus = "needs_review"
    missing_fields: list[str] = Field(default_factory=list)
    support_note: str | None = None
    reviewed_by: str | None = None
    reviewed_at: str | None = None


class Product(BaseModel):
    id: str
    name: str
    price: int = Field(..., description="Narx so‘mda, butun son")
    currency: str = "som"
    seller: str
    merchant_id: str = "moda-uz"
    color: str
    sizes: list[str]
    rating: float
    delivery: str
    category: str
    description: str

    # Media model
    display_image_url: str | None = None
    tryon_reference_image_url: str | None = None
    model_image_url: str | None = None
    back_image_url: str | None = None
    side_image_url: str | None = None
    image_360_urls: list[str] = Field(default_factory=list)

    # Legacy fields kept for frontend compatibility (always populated).
    image_url: str = ""
    tryon_image_url: str = ""

    product_criteria: ProductCriteria = Field(default_factory=ProductCriteria)
    quality_control: QualityControl = Field(default_factory=QualityControl)

    @model_validator(mode="after")
    def _bridge_media_fields(self) -> "Product":
        """Keep legacy and new media fields in sync.

        Note: we never auto-promote a display image to the try-on *reference*;
        that must be set explicitly so the AI never receives a hanger/catalog
        image by accident.
        """
        if not self.display_image_url:
            self.display_image_url = self.image_url or None
        if not self.image_url:
            self.image_url = self.display_image_url or ""
        if not self.tryon_image_url:
            self.tryon_image_url = self.display_image_url or self.image_url or ""
        return self


class RecommendedProduct(Product):
    """A product enriched with AI match metadata for recommendations."""

    match_score: int = Field(..., ge=0, le=100, description="AI moslik foizi")
    section: RecommendationSection


class RecommendationsResponse(BaseModel):
    product_id: str
    stylist_advice: str
    sections: list[RecommendationSection]
    products: list[RecommendedProduct]


# --- Write models -----------------------------------------------------------

class ProductCreate(BaseModel):
    id: str
    name: str
    price: int
    currency: str = "som"
    seller: str
    merchant_id: str = "moda-uz"
    color: str
    sizes: list[str]
    rating: float = 0.0
    delivery: str = "Bepul yetkazib berish"
    category: str
    description: str
    display_image_url: str | None = None
    tryon_reference_image_url: str | None = None
    model_image_url: str | None = None
    back_image_url: str | None = None
    side_image_url: str | None = None
    image_360_urls: list[str] = Field(default_factory=list)
    product_criteria: ProductCriteria = Field(default_factory=ProductCriteria)


class ProductUpdate(BaseModel):
    name: str | None = None
    price: int | None = None
    seller: str | None = None
    color: str | None = None
    sizes: list[str] | None = None
    rating: float | None = None
    delivery: str | None = None
    category: str | None = None
    description: str | None = None
    display_image_url: str | None = None
    tryon_reference_image_url: str | None = None
    model_image_url: str | None = None
    back_image_url: str | None = None
    side_image_url: str | None = None
    image_360_urls: list[str] | None = None
    product_criteria: ProductCriteria | None = None


class ProductQualityResult(BaseModel):
    is_ready: bool
    missing_fields: list[str] = Field(default_factory=list)
    support_note: str
