"""Order schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class OrderCreate(BaseModel):
    product_id: str
    size: str
    customer_name: str = Field(..., min_length=1)
    customer_phone: str = Field(..., min_length=5)
    address: str | None = None


class Order(OrderCreate):
    id: str
    status: str = "qabul_qilindi"
    message: str = "Buyurtma qabul qilindi. Tez orada siz bilan bog‘lanamiz."
    created_at: datetime
