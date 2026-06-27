"""Image upload helper: validate, persist to the uploads dir, build URLs."""

from __future__ import annotations

import uuid
from pathlib import Path

from fastapi import HTTPException, Request, UploadFile

from app.config import settings

_ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
_ALLOWED_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}
_MAX_BYTES = 10 * 1024 * 1024  # 10 MB


def build_public_url(filename: str) -> str | None:
    """Public URL for an uploaded file, or None when PUBLIC_BASE_URL is unset."""
    if not settings.public_base_url:
        return None
    return f"{settings.public_base_url.rstrip('/')}/uploads/{filename}"


async def save_image_upload(request: Request, file: UploadFile) -> tuple[str, str | None]:
    """Validate and store an uploaded image.

    Returns (local_servable_url, public_url_or_None).
    """
    suffix = Path(file.filename or "").suffix.lower()
    if file.content_type not in _ALLOWED_CONTENT_TYPES and suffix not in _ALLOWED_SUFFIXES:
        raise HTTPException(status_code=400, detail="Rasm formati noto‘g‘ri (jpg, png, webp).")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Rasm bo‘sh yoki yuklanmadi.")
    if len(contents) > _MAX_BYTES:
        raise HTTPException(status_code=400, detail="Rasm hajmi 10 MB dan oshmasligi kerak.")

    file_suffix = suffix if suffix in _ALLOWED_SUFFIXES else ".jpg"
    filename = f"{uuid.uuid4().hex}{file_suffix}"
    settings.uploads_path.mkdir(parents=True, exist_ok=True)
    dest = settings.uploads_path / filename
    try:
        dest.write_bytes(contents)
    except OSError as exc:
        raise HTTPException(status_code=500, detail="Rasmni saqlashda xatolik.") from exc

    local_url = str(request.url_for("uploads", path=filename))
    return local_url, build_public_url(filename)
