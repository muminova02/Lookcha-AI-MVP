"""Merchant dashboard and QR/link service (MongoDB-backed)."""

from __future__ import annotations

from app.repositories import merchant_repository
from app.schemas.merchant import MerchantDashboard, QrLink


async def get_dashboard() -> MerchantDashboard:
    doc = await merchant_repository.get_dashboard() or {}
    return MerchantDashboard(**doc)


async def get_qr_link() -> QrLink:
    doc = await merchant_repository.get_qr_link() or {}
    return QrLink(**doc)
