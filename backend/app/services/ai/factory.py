"""AI adapter factory.

Returns the configured try-on adapter based on `settings.ai_provider`.
Add real providers here (e.g. "openai", "gemini", "replicate") without
touching callers.
"""

from __future__ import annotations

from functools import lru_cache

from app.config import settings
from app.services.ai.base import AITryOnAdapter
from app.services.ai.mock_adapter import MockAITryOn
from app.services.ai.nanobanana_adapter import NanoBananaAdapter


@lru_cache
def get_ai_adapter() -> AITryOnAdapter:
    provider = (settings.ai_provider or "mock").lower()

    if provider == "nanobanana":
        return NanoBananaAdapter()

    # Default / "mock". (NanoBanana itself falls back to mock at runtime if
    # its config or image URLs are unusable, so the demo never breaks.)
    return MockAITryOn()
