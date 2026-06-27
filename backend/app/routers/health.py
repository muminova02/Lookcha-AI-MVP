"""Health check endpoint."""

from datetime import datetime, timezone

from fastapi import APIRouter

from app.config import settings

router = APIRouter(tags=["system"])


@router.get("/health")
async def health() -> dict:
    """Liveness probe. Returns basic service info."""
    return {
        "status": "ok",
        "service": settings.app_name,
        "environment": settings.environment,
        "ai_provider": settings.ai_provider,
        "time": datetime.now(timezone.utc).isoformat(),
    }
