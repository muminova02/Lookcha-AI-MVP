"""Product routes: catalog read + merchant/support management + media upload."""

from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile

from app.schemas.product import (
    Product,
    ProductCreate,
    ProductQualityResult,
    ProductUpdate,
)
from app.services import product_service
from app.services.storage_service import save_image_upload

router = APIRouter(prefix="/products", tags=["products"])

MediaType = Literal["display", "tryon_reference", "model", "back", "side", "image_360"]


@router.get("", response_model=list[Product])
async def list_products() -> list[Product]:
    return await product_service.list_products()


@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str) -> Product:
    product = await product_service.get_product(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")
    return product


@router.post("", response_model=Product, status_code=201)
async def create_product(payload: ProductCreate) -> Product:
    try:
        return await product_service.create_product(payload)
    except product_service.ProductExistsError as exc:
        raise HTTPException(status_code=409, detail="Bu id bilan mahsulot mavjud") from exc


@router.patch("/{product_id}", response_model=Product)
async def update_product(product_id: str, payload: ProductUpdate) -> Product:
    product = await product_service.update_product(product_id, payload)
    if product is None:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")
    return product


@router.post("/{product_id}/validate", response_model=ProductQualityResult)
async def validate_product(product_id: str) -> ProductQualityResult:
    result = await product_service.validate_product(product_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")
    return result


@router.patch("/{product_id}/approve", response_model=Product)
async def approve_product(product_id: str) -> Product:
    try:
        product = await product_service.approve_product(product_id)
    except product_service.ProductNotReadyError as exc:
        raise HTTPException(status_code=400, detail=exc.result.support_note) from exc
    if product is None:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")
    return product


@router.patch("/{product_id}/needs-review", response_model=Product)
async def needs_review(product_id: str) -> Product:
    product = await product_service.set_needs_review(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")
    return product


@router.post("/{product_id}/media", response_model=Product)
async def upload_media(
    product_id: str,
    request: Request,
    media_type: MediaType = Form(...),
    file: UploadFile = File(...),
) -> Product:
    existing = await product_service.get_product(product_id)
    if existing is None:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")

    local_url, public_url = await save_image_upload(request, file)

    if media_type == "tryon_reference":
        # Reference must be externally reachable for the real AI; prefer the
        # public URL, but store the local URL too so the upload isn't lost.
        update = ProductUpdate(tryon_reference_image_url=public_url or local_url)
    elif media_type == "display":
        update = ProductUpdate(display_image_url=local_url)
    elif media_type == "model":
        update = ProductUpdate(model_image_url=local_url)
    elif media_type == "back":
        update = ProductUpdate(back_image_url=local_url)
    elif media_type == "side":
        update = ProductUpdate(side_image_url=local_url)
    else:  # image_360
        update = ProductUpdate(image_360_urls=[*existing.image_360_urls, local_url])

    product = await product_service.update_product(product_id, update)
    assert product is not None  # existence checked above

    # If a try-on reference was uploaded but no public URL could be built,
    # flag it for support so it isn't silently sent to the AI later.
    if media_type == "tryon_reference" and not public_url:
        product = await product_service.set_needs_review(
            product_id,
            note=(
                "Try-on reference rasm yuklandi, lekin PUBLIC_BASE_URL sozlanmagan. "
                "Tashqi AI rasmga kira olishi uchun PUBLIC_BASE_URL/ngrok kerak."
            ),
        )

    return product  # type: ignore[return-value]
