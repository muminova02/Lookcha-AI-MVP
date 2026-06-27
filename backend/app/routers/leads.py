"""Lead routes."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.schemas.lead import Lead, LeadCreate
from app.storage import json_store
from app.storage.json_store import StorageError

router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("", response_model=Lead, status_code=201)
async def create_lead(payload: LeadCreate) -> Lead:
    lead = Lead(
        id=f"lead_{uuid.uuid4().hex[:12]}",
        created_at=datetime.now(timezone.utc),
        **payload.model_dump(),
    )
    try:
        json_store.append_item("leads", lead.model_dump(mode="json"))
    except StorageError as exc:
        raise HTTPException(status_code=500, detail="Leadni saqlashda xatolik.") from exc
    return lead
