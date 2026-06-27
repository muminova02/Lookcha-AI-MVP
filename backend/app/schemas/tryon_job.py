"""Try-on job schema (audit trail of every generation attempt)."""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

TryOnJobStatus = Literal[
    "pending", "success", "failed", "fallback", "skipped_needs_review"
]


class TryOnJob(BaseModel):
    job_id: str
    product_id: str
    profile_id: str
    provider: str
    status: TryOnJobStatus
    input_image_urls: list[str] = Field(default_factory=list)
    result_image_url: str | None = None
    match_score: int | None = None
    created_at: datetime
    finished_at: datetime | None = None
    error_message: str | None = None
