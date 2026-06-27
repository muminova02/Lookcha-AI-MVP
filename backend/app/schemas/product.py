"""Product-related schemas."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

# Recommendation sections shown on the AI recommendations page.
RecommendationSection = Literal["sizga_mos", "yoqishi_mumkin", "shu_dokondan", "oxshash"]


class Product(BaseModel):
    id: str
    name: str
    price: int = Field(..., description="Narx so‘mda, butun son")
    currency: str = "som"
    seller: str
    color: str
    sizes: list[str]
    rating: float
    delivery: str
    category: str
    description: str
    image_url: str
    tryon_image_url: str


class RecommendedProduct(Product):
    """A product enriched with AI match metadata for recommendations."""

    match_score: int = Field(..., ge=0, le=100, description="AI moslik foizi")
    section: RecommendationSection


class RecommendationsResponse(BaseModel):
    product_id: str
    stylist_advice: str
    sections: list[RecommendationSection]
    products: list[RecommendedProduct]
