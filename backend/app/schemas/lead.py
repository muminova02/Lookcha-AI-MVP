"""Lead schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class LeadCreate(BaseModel):
    name: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=5)
    product_id: str | None = None
    source: str = "tryon"


class Lead(LeadCreate):
    id: str
    created_at: datetime
