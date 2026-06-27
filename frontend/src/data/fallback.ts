/**
 * Frontend fallback data. Used ONLY when the API is unavailable so the UI can
 * still render meaningful content during development/offline demos.
 * Kept consistent with backend seed data.
 */

import type {
  MerchantDashboard,
  Product,
  QrLink,
  RecommendationsResponse,
  RecommendedProduct,
} from "@/types";

export const fallbackProduct: Product = {
  id: "premium-ipak-koylak",
  name: "Premium ipak ko‘ylak",
  price: 450000,
  currency: "som",
  seller: "Moda UZ",
  color: "Och nilufar",
  sizes: ["S", "M", "L", "XL"],
  rating: 4.8,
  delivery: "Bepul yetkazib berish",
  category: "Ko‘ylak",
  description:
    "Tabiiy ipakdan tikilgan nafis ko‘ylak. Kundalik va maxsus kunlar uchun mos.",
  image_url:
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
  tryon_image_url:
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
};

export const fallbackRecommendedProducts: RecommendedProduct[] = [
  {
    id: "klassik-bordo-koylak",
    name: "Klassik bordo ko‘ylak",
    price: 450000,
    currency: "som",
    seller: "Moda UZ",
    color: "Bordo",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    delivery: "Bepul yetkazib berish",
    category: "Ko‘ylak",
    description: "To‘q bordo rangli klassik ko‘ylak.",
    image_url:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    tryon_image_url:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
    match_score: 92,
    section: "sizga_mos",
  },
  {
    id: "bej-kardigan",
    name: "Bej kardigan",
    price: 320000,
    currency: "som",
    seller: "Moda UZ",
    color: "Bej",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.6,
    delivery: "Bepul yetkazib berish",
    category: "Kardigan",
    description: "Yumshoq trikotajdan tikilgan bej kardigan.",
    image_url:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    tryon_image_url:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    match_score: 88,
    section: "sizga_mos",
  },
  {
    id: "oq-bluzka",
    name: "Oq bluzka",
    price: 250000,
    currency: "som",
    seller: "Moda UZ",
    color: "Oq",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    delivery: "Bepul yetkazib berish",
    category: "Bluzka",
    description: "Yengil va shaffof oq bluzka.",
    image_url:
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=800&q=80",
    tryon_image_url:
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=900&q=80",
    match_score: 85,
    section: "yoqishi_mumkin",
  },
  {
    id: "qora-shim",
    name: "Qora shim",
    price: 280000,
    currency: "som",
    seller: "Moda UZ",
    color: "Qora",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    delivery: "Bepul yetkazib berish",
    category: "Shim",
    description: "Klassik bichimli qora shim.",
    image_url:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
    tryon_image_url:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
    match_score: 83,
    section: "yoqishi_mumkin",
  },
  {
    id: "baxmal-yubka",
    name: "Baxmal yubka",
    price: 380000,
    currency: "som",
    seller: "Moda UZ",
    color: "To‘q yashil",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.6,
    delivery: "Bepul yetkazib berish",
    category: "Yubka",
    description: "Baxmaldan tikilgan zamonaviy yubka.",
    image_url:
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=800&q=80",
    tryon_image_url:
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80",
    match_score: 80,
    section: "shu_dokondan",
  },
  {
    id: "kuzgi-palto",
    name: "Kuzgi palto",
    price: 850000,
    currency: "som",
    seller: "Moda UZ",
    color: "Kamel",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    delivery: "Bepul yetkazib berish",
    category: "Palto",
    description: "Issiq jundan tikilgan kamel rangli kuzgi palto.",
    image_url:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80",
    tryon_image_url:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80",
    match_score: 78,
    section: "oxshash",
  },
];

export const fallbackProducts: Product[] = [
  fallbackProduct,
  ...fallbackRecommendedProducts.map(
    ({ match_score: _m, section: _s, ...product }) => product,
  ),
];

export const fallbackRecommendations: RecommendationsResponse = {
  product_id: "premium-ipak-koylak",
  stylist_advice:
    "Bu kiyim sizga yaxshi tushdi. Sizning uslub profilingizga ko‘ra bej, qora va bordo rangdagi klassik modellar ham mos keladi. Mana shu platformadan sizga mos variantlar.",
  sections: ["sizga_mos", "yoqishi_mumkin", "shu_dokondan", "oxshash"],
  products: fallbackRecommendedProducts,
};

export const fallbackDashboard: MerchantDashboard = {
  store_name: "Moda UZ",
  kpis: {
    tryon_count: 1248,
    new_leads: 86,
    plan: "Pro paket",
    remaining_limit: 752,
  },
  integration: { api_widget: "Faol", qr_link: "Faol", marketplace: "Tayyor" },
  traffic_sources: [
    { source: "Instagram", visits: 540, percent: 43 },
    { source: "Telegram", visits: 360, percent: 29 },
    { source: "Web sayt", visits: 210, percent: 17 },
    { source: "QR (offline)", visits: 138, percent: 11 },
  ],
  top_products: [
    { product_id: "premium-ipak-koylak", name: "Premium ipak ko‘ylak", tryons: 412 },
    { product_id: "klassik-bordo-koylak", name: "Klassik bordo ko‘ylak", tryons: 305 },
    { product_id: "bej-kardigan", name: "Bej kardigan", tryons: 221 },
    { product_id: "kuzgi-palto", name: "Kuzgi palto", tryons: 184 },
  ],
  interested_customers: [
    { name: "Madina K.", product: "Premium ipak ko‘ylak", match_score: 92, source: "Instagram" },
    { name: "Dilnoza R.", product: "Klassik bordo ko‘ylak", match_score: 88, source: "Telegram" },
    { name: "Sevara A.", product: "Bej kardigan", match_score: 85, source: "QR (offline)" },
  ],
  conversion: { tryon_to_lead: 18.4, lead_to_order: 31.2, overall: 5.7 },
  ai_advice:
    "Premium ipak ko‘ylak eng ko‘p sinab ko‘rilmoqda, ammo konversiya o‘rtacha. Mahsulot sahifasiga bepul yetkazib berish va o‘lcham jadvalini qo‘shsangiz, buyurtmalar oshishi mumkin.",
};

export const fallbackQrLink: QrLink = {
  store_name: "Moda UZ",
  store_link: "https://lookcha.ai/s/moda-uz",
  qr_image_url:
    "https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=https://lookcha.ai/s/moda-uz",
  instagram_bio_link: "https://lookcha.ai/s/moda-uz?utm_source=instagram",
  widget_embed_code:
    '<script src="https://cdn.lookcha.ai/widget.js" data-store="moda-uz"></script>\n<lookcha-button product-id="premium-ipak-koylak"></lookcha-button>',
  stats: { via_qr: 138, via_link_tryon: 421 },
};
