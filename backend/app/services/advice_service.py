"""Build try-on advice from real product criteria + the user's profile.

Replaces the previously static advice string with guidance derived from fit
type, fabric, stretch, and length so the AI moslik tahlili feels specific.
"""

from __future__ import annotations

from app.schemas.product import Product
from app.schemas.tryon import ProfileData


def build_ai_advice(product: Product, profile: ProfileData, match_score: int) -> str:
    c = product.product_criteria
    size = profile.usual_size or "M"
    parts: list[str] = [f"AI moslik {match_score}%."]

    if c.fit_type == "oversize":
        parts.append(
            f"Bu oversize model sizga erkin va qulay tushadi. "
            f"{size} razmer kundalik kiyish uchun mos bo‘lishi mumkin."
        )
    elif c.fit_type == "slim":
        parts.append(
            "Bu slim fason tana chizig‘ini ko‘proq ko‘rsatadi, "
            "shuning uchun razmer tanlashda ehtiyot bo‘lish tavsiya etiladi."
        )
    elif c.fit_type == "loose":
        parts.append("Bu loose fason erkin tushadi va harakatda qulaylik beradi.")
    elif c.fit_type == "regular":
        parts.append(
            f"Bu regular fason ko‘pchilikka mos keladi. "
            f"{size} razmer sizga to‘g‘ri kelishi mumkin."
        )

    if c.stretch_level == "high":
        parts.append("Mato cho‘ziluvchan, shuning uchun tana harakatida qulaylik beradi.")
    elif c.stretch_level in ("none", "low"):
        parts.append("Mato deyarli cho‘zilmaydi, shuning uchun aniq razmer tanlash muhim.")

    fabric = (c.fabric_type or "").lower()
    if "paxta" in fabric:
        parts.append("Paxta tarkibli mato kundalik kiyish uchun nafas oluvchi va qulay.")
    elif "ipak" in fabric:
        parts.append("Ipak mato nafis va yengil, maxsus kunlar uchun ayni muddao.")
    elif "jun" in fabric:
        parts.append("Jun mato issiq saqlaydi, salqin mavsum uchun mos.")

    if c.length_info:
        parts.append(f"Uzunligi: {c.length_info}.")

    if len(parts) == 1:
        # No criteria available — fall back to the original generic advice.
        parts.append(
            "Bu model sizning gavda tuzilishingizga mos tushadi. "
            "Uzunligi, bel qismi va umumiy silueti yaxshi ko‘rinmoqda."
        )

    return " ".join(parts)
