"""Lead routes."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.repositories import lead_repository
from app.schemas.lead import Lead, LeadCreate

router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("", response_model=Lead, status_code=201)
async def create_lead(payload: LeadCreate) -> Lead:
    lead = Lead(
        id=f"lead_{uuid.uuid4().hex[:12]}",
        created_at=datetime.now(timezone.utc),
        **payload.model_dump(),
    )
    try:
        await lead_repository.create(lead.model_dump(mode="json"))
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail="Leadni saqlashda xatolik.") from exc
    return lead
