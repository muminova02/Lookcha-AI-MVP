"""Merchant dashboard and QR/link schemas."""

from __future__ import annotations

from pydantic import BaseModel


class MerchantKpis(BaseModel):
    tryon_count: int
    new_leads: int
    plan: str
    remaining_limit: int


class MerchantIntegration(BaseModel):
    api_widget: str
    qr_link: str
    marketplace: str


class TrafficSource(BaseModel):
    source: str
    visits: int
    percent: int


class TopProduct(BaseModel):
    product_id: str
    name: str
    tryons: int


class InterestedCustomer(BaseModel):
    name: str
    product: str
    match_score: int
    source: str


class ConversionStats(BaseModel):
    tryon_to_lead: float
    lead_to_order: float
    overall: float


class MerchantDashboard(BaseModel):
    store_name: str
    kpis: MerchantKpis
    integration: MerchantIntegration
    traffic_sources: list[TrafficSource]
    top_products: list[TopProduct]
    interested_customers: list[InterestedCustomer]
    conversion: ConversionStats
    ai_advice: str


class QrLinkStats(BaseModel):
    via_qr: int
    via_link_tryon: int


class QrLink(BaseModel):
    store_name: str
    store_link: str
    qr_image_url: str
    instagram_bio_link: str
    widget_embed_code: str
    stats: QrLinkStats
