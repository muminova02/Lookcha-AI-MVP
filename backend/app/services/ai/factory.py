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


@lru_cache
def get_ai_adapter() -> AITryOnAdapter:
    provider = (settings.ai_provider or "mock").lower()

    if provider == "mock":
        return MockAITryOn()

    # Real providers plug in here later, e.g.:
    # if provider == "replicate":
    #     return ReplicateTryOn(api_key=settings.ai_api_key, model=settings.ai_model)

    raise ValueError(f"Unsupported AI_PROVIDER: {provider!r}")
