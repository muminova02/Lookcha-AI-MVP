"""Try-on routes: profile upload and AI generation."""

from __future__ import annotations

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from pydantic import ValidationError

from app.schemas.tryon import (
    ProfileData,
    ProfileUploadResponse,
    TryOnGenerateRequest,
    TryOnResult,
)
from app.services import tryon_service
from app.services.storage_service import save_image_upload

router = APIRouter(prefix="/tryon", tags=["tryon"])


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
    # Validate profile fields first (cheap) before persisting the file.
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

    photo_url, public_photo_url = await save_image_upload(request, photo)
    profile_id = await tryon_service.save_profile(profile, photo_url, public_photo_url)

    return ProfileUploadResponse(profile_id=profile_id, photo_url=photo_url)


@router.post("/generate", response_model=TryOnResult)
async def generate(payload: TryOnGenerateRequest) -> TryOnResult:
    try:
        return await tryon_service.generate_tryon(payload.product_id, payload.profile_id)
    except tryon_service.ProductNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi") from exc
    except tryon_service.ProfileNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Profil topilmadi") from exc
