"""NanoBanana Pro virtual try-on adapter.

Flow (per official docs):
1. Create task:  POST {base}/api/v1/nanobanana/generate-pro
2. Poll result:  GET  {base}/api/v1/nanobanana/record-info?taskId=...

Docs:
- https://docs.nanobananaapi.ai/nanobanana-api/generate-image-pro
- https://docs.nanobananaapi.ai/nanobanana-api/get-task-details

Image inputs are strictly:
  [ customer_public_photo_url, product.tryon_reference_image_url ]
The display/catalog image is never sent, so the model can't be fed a
hanger/collage reference. Any failure falls back to MockAITryOn (source="mock")
so the demo never breaks and the frontend contract is preserved.
"""

from __future__ import annotations

import asyncio
import logging
from urllib.parse import urlparse

import httpx

from app.config import settings
from app.schemas.product import Product
from app.schemas.tryon import AIGeneration, ProfileData
from app.services.ai.base import AITryOnAdapter
from app.services.ai.mock_adapter import MockAITryOn

logger = logging.getLogger("lookcha.ai.nanobanana")

_PROMPT = (
    "Create a realistic virtual try-on image for Lookcha AI. Use the first image "
    "as the customer full-body reference and the second image as the clean "
    "clothing reference. Dress the customer in the selected clothing item "
    "naturally. The final image must show the customer from head to toe, "
    "including head, upper body, waist, legs, and feet. Do not crop the body. "
    "Do not show the clothing on a hanger. Do not show a product catalog image. "
    "Remove hanger context. Preserve natural body proportions, posture, and "
    "identity as much as possible. Show the full outfit silhouette clearly. Use a "
    "clean studio or fitting-room background. The fashion style must be modest, "
    "modern, and suitable for Uzbekistan. No abstract gradient, no blur, no "
    "half-body crop, no missing feet, no missing head, no watermark, no text overlay."
)

_MAX_ATTEMPTS = 20
_POLL_INTERVAL_SECONDS = 2.0
_HTTP_TIMEOUT = 30.0


def _is_public_http_url(url: str | None) -> bool:
    """True only for absolute http(s) URLs that are not localhost/private hosts."""
    if not url:
        return False
    try:
        parsed = urlparse(url)
    except ValueError:
        return False
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        return False
    host = parsed.hostname.lower()
    blocked = {"localhost", "127.0.0.1", "0.0.0.0", "::1"}
    if host in blocked or host.endswith(".local"):
        return False
    return True


class NanoBananaAdapter(AITryOnAdapter):
    name = "nanobanana"

    def __init__(self) -> None:
        self._api_key = settings.nanobanana_api_key
        self._base_url = settings.nanobanana_base_url.rstrip("/")
        self._fallback = MockAITryOn()

    async def generate(
        self,
        product: Product,
        profile: ProfileData,
        photo_url: str | None = None,
    ) -> AIGeneration:
        # `photo_url` is the customer's *public* photo URL (built by the service).
        if not self._api_key:
            return await self._fallback_with("NANOBANANA_API_KEY yo‘q", product, profile, photo_url)

        if not _is_public_http_url(photo_url):
            return await self._fallback_with(
                "Mijoz rasmi uchun ochiq URL yo‘q (PUBLIC_BASE_URL/ngrok kerak)",
                product, profile, photo_url,
            )

        product_ref = product.tryon_reference_image_url
        if not _is_public_http_url(product_ref):
            return await self._fallback_with(
                "Mahsulotda ochiq try-on reference rasm yo‘q", product, profile, photo_url
            )

        try:
            async with httpx.AsyncClient(timeout=_HTTP_TIMEOUT) as client:
                task_id = await self._create_task(client, photo_url, product_ref)
                if not task_id:
                    return await self._fallback_with("Task yaratilmadi", product, profile, photo_url)

                result_url = await self._poll_result(client, task_id)
                if not result_url:
                    return await self._fallback_with(
                        "Natija olinmadi yoki vaqt tugadi", product, profile, photo_url
                    )

            return AIGeneration(
                tryon_image_url=result_url,
                match_score=88,
                size_recommendation="M",
                color_match="Juda yaxshi",
                advice=(
                    "Bu model sizning gavda tuzilishingizga mos tushadi. "
                    "Uzunligi, bel qismi va umumiy silueti yaxshi ko‘rinmoqda."
                ),
                source="nanobanana",
            )
        except (httpx.HTTPError, ValueError, KeyError) as exc:
            return await self._fallback_with(
                f"NanoBanana xatosi: {type(exc).__name__}", product, profile, photo_url
            )

    async def _create_task(
        self, client: httpx.AsyncClient, customer_url: str, product_url: str
    ) -> str | None:
        payload = {
            "prompt": _PROMPT,
            "imageUrls": [customer_url, product_url],
            "resolution": settings.nanobanana_resolution,
            "callBackUrl": settings.nanobanana_callback_url,
            "aspectRatio": settings.nanobanana_aspect_ratio,
        }
        resp = await client.post(
            f"{self._base_url}/api/v1/nanobanana/generate-pro",
            json=payload,
            headers=self._headers(),
        )
        resp.raise_for_status()
        body = resp.json()
        if body.get("code") != 200:
            logger.warning("NanoBanana create-task non-200 code: %s", body.get("code"))
            return None
        return (body.get("data") or {}).get("taskId")

    async def _poll_result(self, client: httpx.AsyncClient, task_id: str) -> str | None:
        for attempt in range(_MAX_ATTEMPTS):
            await asyncio.sleep(_POLL_INTERVAL_SECONDS)
            resp = await client.get(
                f"{self._base_url}/api/v1/nanobanana/record-info",
                params={"taskId": task_id},
                headers=self._headers(),
            )
            resp.raise_for_status()
            data = resp.json().get("data") or {}
            flag = data.get("successFlag")

            if flag == 1:
                result_url = (data.get("response") or {}).get("resultImageUrl")
                if result_url:
                    return result_url
                logger.warning("NanoBanana success but no resultImageUrl")
                return None
            if flag in (2, 3):
                logger.warning(
                    "NanoBanana generation failed (flag=%s, code=%s)",
                    flag, data.get("errorCode"),
                )
                return None
            logger.debug("NanoBanana still generating (attempt %s)", attempt + 1)
        logger.warning("NanoBanana polling timed out after %s attempts", _MAX_ATTEMPTS)
        return None

    def _headers(self) -> dict[str, str]:
        # Authorization header value is never logged.
        return {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json",
        }

    async def _fallback_with(
        self, reason: str, product: Product, profile: ProfileData, photo_url: str | None
    ) -> AIGeneration:
        logger.warning("NanoBanana fallback to mock: %s", reason)
        return await self._fallback.generate(product, profile, photo_url)
