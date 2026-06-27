"""Seed MongoDB with demo data for Lookcha AI.

Run:  python -m app.scripts.seed_mongo

Idempotent: clears the seeded collections, then inserts a merchant, the main
product (fully approved for AI try-on), recommendation products, recommendation
blocks, the merchant dashboard, and the QR/link doc.
"""

from __future__ import annotations

import asyncio

from app.db.mongodb import (
    close_mongo_connection,
    connect_to_mongo,
    ensure_indexes,
    get_database,
)
from app.schemas.product import Product, ProductCriteria, QualityControl

MERCHANT_ID = "moda-uz"


def _product(
    *,
    id: str,
    name: str,
    price: int,
    color: str,
    category: str,
    description: str,
    display_image_url: str,
    tryon_reference_image_url: str,
    rating: float,
    criteria: ProductCriteria,
    approved: bool,
    model_image_url: str | None = None,
) -> dict:
    quality = QualityControl(
        ai_ready_status="approved" if approved else "needs_review",
        support_note="AI try-on uchun tasdiqlangan." if approved else None,
        reviewed_by="support" if approved else None,
    )
    product = Product(
        id=id,
        name=name,
        price=price,
        currency="som",
        seller="Moda UZ",
        merchant_id=MERCHANT_ID,
        color=color,
        sizes=["S", "M", "L", "XL"],
        rating=rating,
        delivery="Bepul yetkazib berish",
        category=category,
        description=description,
        display_image_url=display_image_url,
        tryon_reference_image_url=tryon_reference_image_url,
        model_image_url=model_image_url,
        product_criteria=criteria,
        quality_control=quality,
    )
    return product.model_dump(mode="json")


def _basic_criteria(
    fit: str, fabric: str, composition: str, stretch: str, length: str, silhouette: str
) -> ProductCriteria:
    return ProductCriteria(
        size_chart_available=True,
        available_sizes=["S", "M", "L", "XL"],
        fit_type=fit,  # type: ignore[arg-type]
        fabric_type=fabric,
        fabric_composition=composition,
        stretch_level=stretch,  # type: ignore[arg-type]
        length_info=length,
        silhouette=silhouette,
        real_color_confirmed=True,
        care_info="Qo‘lda yoki nozik rejimda yuvish tavsiya etiladi.",
        model_height_cm=172,
        model_wearing_size="M",
    )


PRODUCTS: list[dict] = [
    _product(
        id="premium-ipak-koylak",
        name="Premium ipak ko‘ylak",
        price=450000,
        color="Och nilufar",
        category="Ko‘ylak",
        description="Tabiiy ipakdan tikilgan nafis ko‘ylak. Kundalik va maxsus kunlar uchun mos.",
        display_image_url="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
        tryon_reference_image_url="https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
        rating=4.8,
        criteria=_basic_criteria(
            "regular", "Ipak", "100% tabiiy ipak", "low", "Tizza ostigacha", "A-silueti"
        ),
        approved=True,
        model_image_url="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
    ),
    _product(
        id="klassik-bordo-koylak",
        name="Klassik bordo ko‘ylak",
        price=450000,
        color="Bordo",
        category="Ko‘ylak",
        description="To‘q bordo rangli klassik ko‘ylak. Kechki tadbirlar uchun ideal tanlov.",
        display_image_url="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
        tryon_reference_image_url="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
        rating=4.7,
        criteria=_basic_criteria(
            "regular", "Poliester", "95% poliester, 5% elastan", "medium", "Tizzagacha", "To‘g‘ri"
        ),
        approved=True,
    ),
    _product(
        id="bej-kardigan",
        name="Bej kardigan",
        price=320000,
        color="Bej",
        category="Kardigan",
        description="Yumshoq trikotajdan tikilgan bej kardigan. Kuzgi mavsum uchun qulay.",
        display_image_url="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
        tryon_reference_image_url="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
        rating=4.6,
        criteria=_basic_criteria(
            "oversize", "Trikotaj", "70% paxta, 30% akril", "medium", "Son o‘rtasigacha", "Erkin"
        ),
        approved=True,
    ),
    _product(
        id="qora-shim",
        name="Qora shim",
        price=280000,
        color="Qora",
        category="Shim",
        description="Klassik bichimli qora shim. Ofis va kundalik kiyim uchun mos.",
        display_image_url="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
        tryon_reference_image_url="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
        rating=4.5,
        criteria=_basic_criteria(
            "slim", "Gabardin", "98% paxta, 2% elastan", "low", "To‘piqqacha", "Slim"
        ),
        approved=True,
    ),
    _product(
        id="oq-bluzka",
        name="Oq bluzka",
        price=250000,
        color="Oq",
        category="Bluzka",
        description="Yengil va shaffof oq bluzka. Har qanday liboslar bilan uyg‘unlashadi.",
        display_image_url="https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=800&q=80",
        tryon_reference_image_url="https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=900&q=80",
        rating=4.7,
        criteria=_basic_criteria(
            "regular", "Paxta", "100% paxta", "low", "Bel qismigacha", "To‘g‘ri"
        ),
        approved=True,
    ),
    _product(
        id="baxmal-yubka",
        name="Baxmal yubka",
        price=380000,
        color="To‘q yashil",
        category="Yubka",
        description="Baxmaldan tikilgan zamonaviy yubka. Kechki uslub uchun nafis yechim.",
        display_image_url="https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=800&q=80",
        tryon_reference_image_url="https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
        rating=4.6,
        criteria=_basic_criteria(
            "regular", "Baxmal", "90% poliester, 10% elastan", "medium", "Tizzagacha", "A-silueti"
        ),
        approved=True,
    ),
    _product(
        id="kuzgi-palto",
        name="Kuzgi palto",
        price=850000,
        color="Kamel",
        category="Palto",
        description="Issiq jundan tikilgan kamel rangli kuzgi palto. Nafis va zamonaviy.",
        display_image_url="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80",
        tryon_reference_image_url="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80",
        rating=4.9,
        criteria=_basic_criteria(
            "oversize", "Jun", "80% jun, 20% poliester", "none", "Tizza ostigacha", "Cocoon"
        ),
        approved=True,
    ),
]

RECOMMENDATIONS: list[dict] = [
    {
        "product_id": "premium-ipak-koylak",
        "stylist_advice": (
            "Bu kiyim sizga yaxshi tushdi. Sizning uslub profilingizga ko‘ra bej, qora va "
            "bordo rangdagi klassik modellar ham mos keladi. Mana shu platformadan sizga "
            "mos variantlar."
        ),
        "items": [
            {"product_id": "klassik-bordo-koylak", "match_score": 92, "section": "sizga_mos"},
            {"product_id": "bej-kardigan", "match_score": 88, "section": "sizga_mos"},
            {"product_id": "oq-bluzka", "match_score": 85, "section": "yoqishi_mumkin"},
            {"product_id": "qora-shim", "match_score": 83, "section": "yoqishi_mumkin"},
            {"product_id": "baxmal-yubka", "match_score": 80, "section": "shu_dokondan"},
            {"product_id": "kuzgi-palto", "match_score": 78, "section": "oxshash"},
        ],
    },
    {
        "product_id": "_default",
        "stylist_advice": "Sizning uslubingizga mos keladigan platformadagi boshqa variantlar.",
        "items": [
            {"product_id": "premium-ipak-koylak", "match_score": 90, "section": "sizga_mos"},
            {"product_id": "klassik-bordo-koylak", "match_score": 87, "section": "sizga_mos"},
            {"product_id": "bej-kardigan", "match_score": 84, "section": "yoqishi_mumkin"},
            {"product_id": "oq-bluzka", "match_score": 82, "section": "shu_dokondan"},
            {"product_id": "kuzgi-palto", "match_score": 79, "section": "oxshash"},
        ],
    },
]

MERCHANT = {
    "merchant_id": MERCHANT_ID,
    "name": "Moda UZ",
    "plan": "Pro paket",
    "contact": "+998 90 000 00 00",
}

MERCHANT_DASHBOARD = {
    "store_name": "Moda UZ",
    "kpis": {"tryon_count": 1248, "new_leads": 86, "plan": "Pro paket", "remaining_limit": 752},
    "integration": {"api_widget": "Faol", "qr_link": "Faol", "marketplace": "Tayyor"},
    "traffic_sources": [
        {"source": "Instagram", "visits": 540, "percent": 43},
        {"source": "Telegram", "visits": 360, "percent": 29},
        {"source": "Web sayt", "visits": 210, "percent": 17},
        {"source": "QR (offline)", "visits": 138, "percent": 11},
    ],
    "top_products": [
        {"product_id": "premium-ipak-koylak", "name": "Premium ipak ko‘ylak", "tryons": 412},
        {"product_id": "klassik-bordo-koylak", "name": "Klassik bordo ko‘ylak", "tryons": 305},
        {"product_id": "bej-kardigan", "name": "Bej kardigan", "tryons": 221},
        {"product_id": "kuzgi-palto", "name": "Kuzgi palto", "tryons": 184},
    ],
    "interested_customers": [
        {"name": "Madina K.", "product": "Premium ipak ko‘ylak", "match_score": 92, "source": "Instagram"},
        {"name": "Dilnoza R.", "product": "Klassik bordo ko‘ylak", "match_score": 88, "source": "Telegram"},
        {"name": "Sevara A.", "product": "Bej kardigan", "match_score": 85, "source": "QR (offline)"},
    ],
    "conversion": {"tryon_to_lead": 18.4, "lead_to_order": 31.2, "overall": 5.7},
    "ai_advice": (
        "Premium ipak ko‘ylak eng ko‘p sinab ko‘rilmoqda, ammo konversiya o‘rtacha. Mahsulot "
        "sahifasiga bepul yetkazib berish va o‘lcham jadvalini qo‘shsangiz, buyurtmalar oshishi mumkin."
    ),
}

QR_LINK = {
    "store_name": "Moda UZ",
    "store_link": "https://lookcha.ai/s/moda-uz",
    "qr_image_url": "https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=https://lookcha.ai/s/moda-uz",
    "instagram_bio_link": "https://lookcha.ai/s/moda-uz?utm_source=instagram",
    "widget_embed_code": (
        '<script src="https://cdn.lookcha.ai/widget.js" data-store="moda-uz"></script>\n'
        '<lookcha-button product-id="premium-ipak-koylak"></lookcha-button>'
    ),
    "stats": {"via_qr": 138, "via_link_tryon": 421},
}


async def seed() -> None:
    await connect_to_mongo()
    db = get_database()

    for coll in ("products", "recommendations", "merchant_dashboard", "qr_links", "merchants"):
        await db[coll].delete_many({})

    await db.products.insert_many([dict(p) for p in PRODUCTS])
    await db.recommendations.insert_many([dict(r) for r in RECOMMENDATIONS])
    await db.merchants.insert_one(dict(MERCHANT))
    await db.merchant_dashboard.insert_one(dict(MERCHANT_DASHBOARD))
    await db.qr_links.insert_one(dict(QR_LINK))

    await ensure_indexes()

    print(
        f"Seed OK -> products={len(PRODUCTS)}, recommendations={len(RECOMMENDATIONS)}, "
        f"merchant=1, dashboard=1, qr_link=1"
    )
    await close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(seed())
