"""Merchant routes."""

from __future__ import annotations

from fastapi import APIRouter

from app.schemas.merchant import MerchantDashboard, QrLink
from app.services import merchant_service

router = APIRouter(prefix="/merchant", tags=["merchant"])


@router.get("/dashboard", response_model=MerchantDashboard)
async def get_dashboard() -> MerchantDashboard:
    return merchant_service.get_dashboard()


@router.get("/qr-link", response_model=QrLink)
async def get_qr_link() -> QrLink:
    return merchant_service.get_qr_link()
