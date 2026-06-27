"""Merchant dashboard and QR/link service."""

from __future__ import annotations

from app.schemas.merchant import MerchantDashboard, QrLink
from app.storage import json_store


def get_dashboard() -> MerchantDashboard:
    return MerchantDashboard(**json_store.read_json("merchant", default={}))


def get_qr_link() -> QrLink:
    return QrLink(**json_store.read_json("qr_link", default={}))
