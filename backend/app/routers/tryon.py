"""Try-on routes: profile upload and AI generation."""

from __future__ import annotations

import uuid
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from pydantic import ValidationError

from app.config import settings
from app.schemas.tryon import (
    ProfileData,
    ProfileUploadResponse,
    TryOnGenerateRequest,
    TryOnResult,
)
from app.services import tryon_service

router = APIRouter(prefix="/tryon", tags=["tryon"])

_ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
_ALLOWED_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}
_MAX_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/upload-profile", response_model=ProfileUploadResponse)
async def upload_profile(
    request: Request,
    photo: UploadFile = File(...),
    height_cm: int = Form(...),
    weight_kg: int = Form(...),
    age_range: str = Form(...),
    usual_size: str = Form(...),
    body_type: str = Form(...),
    style: str = Form(...),
    occasion: str = Form(...),
) -> ProfileUploadResponse:
    # Validate file type.
    suffix = Path(photo.filename or "").suffix.lower()
    if photo.content_type not in _ALLOWED_CONTENT_TYPES and suffix not in _ALLOWED_SUFFIXES:
        raise HTTPException(status_code=400, detail="Rasm formati noto‘g‘ri (jpg, png, webp).")

    contents = await photo.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Rasm bo‘sh yoki yuklanmadi.")
    if len(contents) > _MAX_BYTES:
        raise HTTPException(status_code=400, detail="Rasm hajmi 10 MB dan oshmasligi kerak.")

    # Validate profile fields.
    try:
        profile = ProfileData(
            height_cm=height_cm,
            weight_kg=weight_kg,
            age_range=age_range,
            usual_size=usual_size,
            body_type=body_type,
            style=style,
            occasion=occasion,
        )
    except ValidationError as exc:
        raise HTTPException(status_code=400, detail=exc.errors()) from exc

    # Save the photo.
    file_suffix = suffix if suffix in _ALLOWED_SUFFIXES else ".jpg"
    filename = f"{uuid.uuid4().hex}{file_suffix}"
    settings.uploads_path.mkdir(parents=True, exist_ok=True)
    dest = settings.uploads_path / filename
    try:
        dest.write_bytes(contents)
    except OSError as exc:
        raise HTTPException(status_code=500, detail="Rasmni saqlashda xatolik.") from exc

    photo_url = str(request.url_for("uploads", path=filename))
    profile_id = tryon_service.save_profile(profile, photo_url)

    return ProfileUploadResponse(profile_id=profile_id, photo_url=photo_url)


@router.post("/generate", response_model=TryOnResult)
async def generate(payload: TryOnGenerateRequest) -> TryOnResult:
    try:
        return await tryon_service.generate_tryon(payload.product_id, payload.profile_id)
    except tryon_service.ProductNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi") from exc
    except tryon_service.ProfileNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Profil topilmadi") from exc
