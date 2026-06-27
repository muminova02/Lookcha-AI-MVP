"""Product quality / AI-readiness validation.

Decides whether a product may be sent to the real AI try-on. The core rule:
a product must have an explicit, clean `tryon_reference_image_url` plus enough
fit/fabric/size metadata, and must be explicitly *approved* by support.
"""

from __future__ import annotations

from app.schemas.product import Product, ProductQualityResult

# Human-readable Uzbek labels for missing fields (used in support notes).
_FIELD_LABELS: dict[str, str] = {
    "tryon_reference_image_url": "try-on reference rasm",
    "size_chart_available": "razmer setkasi",
    "available_sizes": "mavjud razmerlar",
    "fit_type": "fason turi (fit)",
    "fabric_type": "mato turi",
    "stretch_level": "cho‘ziluvchanlik darajasi",
    "real_color_confirmed": "haqiqiy rang tasdig‘i",
    "extra_media": "qo‘shimcha rasm (model/orqa/yon/360)",
    "ai_ready_status": "support tasdig‘i (approved)",
}


def _criteria_missing(product: Product) -> list[str]:
    """Return the list of unmet *criteria* fields (ignores approval status)."""
    c = product.product_criteria
    missing: list[str] = []

    if not product.tryon_reference_image_url:
        missing.append("tryon_reference_image_url")
    if not c.size_chart_available:
        missing.append("size_chart_available")
    if not c.available_sizes:
        missing.append("available_sizes")
    if c.fit_type == "unknown":
        missing.append("fit_type")
    if not c.fabric_type:
        missing.append("fabric_type")
    if c.stretch_level == "unknown":
        missing.append("stretch_level")
    if not c.real_color_confirmed:
        missing.append("real_color_confirmed")

    has_extra_media = bool(
        product.model_image_url
        or product.back_image_url
        or product.side_image_url
        or product.image_360_urls
    )
    # MVP rule: extra media OR enough product data (size chart + fabric) is fine.
    enough_data = c.size_chart_available and bool(c.fabric_type)
    if not has_extra_media and not enough_data:
        missing.append("extra_media")

    return missing


def _support_note(missing: list[str]) -> str:
    if not missing:
        return "Mahsulot AI try-on uchun tayyor."
    labels = ", ".join(_FIELD_LABELS.get(m, m) for m in missing)
    return (
        "Mahsulot AI try-on uchun to‘liq tayyor emas. "
        "Razmer setkasi, mato turi yoki try-on reference rasm yetishmayapti. "
        f"Yetishmayotgan ma’lumotlar: {labels}."
    )


def validate_product_criteria(product: Product) -> ProductQualityResult:
    """Validate criteria/media only (used on create/update and /validate)."""
    missing = _criteria_missing(product)
    return ProductQualityResult(
        is_ready=not missing,
        missing_fields=missing,
        support_note=_support_note(missing),
    )


def validate_product_for_tryon(product: Product) -> ProductQualityResult:
    """Full gate for AI generation: criteria complete AND status == approved."""
    missing = _criteria_missing(product)
    approved = product.quality_control.ai_ready_status == "approved"
    if not approved:
        missing = [*missing, "ai_ready_status"]

    is_ready = not missing

    if is_ready:
        note = "Mahsulot AI try-on uchun tayyor."
    elif missing == ["ai_ready_status"]:
        # Criteria are complete; only support approval is missing.
        note = (
            "Mahsulot AI try-on uchun hali tasdiqlanmagan. "
            "Try-on reference rasm va mahsulot kriteriyalari to‘ldirilishi kerak."
        )
    else:
        note = _support_note([m for m in missing if m != "ai_ready_status"])

    return ProductQualityResult(is_ready=is_ready, missing_fields=missing, support_note=note)


def apply_quality_status(product: Product) -> Product:
    """Recompute quality_control after a create/update.

    - Records missing criteria fields + a support note.
    - If criteria are incomplete, downgrades an `approved` product to
      `needs_review` (incomplete products must never stay approved).
    - Never auto-approves: a complete product still waits for support approval.
    """
    result = validate_product_criteria(product)
    qc = product.quality_control
    qc.missing_fields = result.missing_fields
    qc.support_note = result.support_note
    if result.missing_fields and qc.ai_ready_status == "approved":
        qc.ai_ready_status = "needs_review"
    return product
