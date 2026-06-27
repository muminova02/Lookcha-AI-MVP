"""AI try-on adapter interface.

Every provider (mock, OpenAI, Gemini, Replicate, ...) implements this
contract. Routers/services depend only on `AITryOnAdapter`, so swapping the
provider is a config change, not a code change.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

from app.schemas.product import Product
from app.schemas.tryon import AIGeneration, ProfileData


class AITryOnAdapter(ABC):
    """Abstract base class for virtual try-on providers."""

    name: str = "base"

    @abstractmethod
    async def generate(self, product: Product, profile: ProfileData) -> AIGeneration:
        """Generate a virtual try-on result for `product` given `profile`.

        Implementations should return an `AIGeneration` with a full-body
        (head-to-toe) `tryon_image_url`, a match score, size/color guidance,
        and human-readable advice in Uzbek (Latin).
        """
        raise NotImplementedError
