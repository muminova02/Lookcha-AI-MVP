"""Mock AI try-on adapter.

Simulates a real virtual try-on call: adds a short processing delay and
returns a deterministic, realistic result. The full-body preview reuses the
product's `tryon_image_url` so the UI always shows a clear head-to-toe image
(never a gradient/blur placeholder).
"""

from __future__ import annotations

import asyncio
import random

from app.schemas.product import Product
from app.schemas.tryon import AIGeneration, ProfileData
from app.services.ai.base import AITryOnAdapter

_ADVICE = (
    "Bu model sizning gavda tuzilishingizga mos tushadi. "
    "Uzunligi, bel qismi va umumiy silueti yaxshi ko‘rinmoqda."
)


class MockAITryOn(AITryOnAdapter):
    name = "mock"

    async def generate(
        self,
        product: Product,
        profile: ProfileData,
        photo_url: str | None = None,
    ) -> AIGeneration:
        # Simulate model inference latency (1.5–2.0s).
        await asyncio.sleep(random.uniform(1.5, 2.0))

        return AIGeneration(
            tryon_image_url=product.tryon_image_url,
            match_score=88,
            size_recommendation="M",
            color_match="Juda yaxshi",
            advice=_ADVICE,
        )
