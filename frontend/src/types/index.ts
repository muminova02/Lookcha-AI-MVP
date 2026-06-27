/** Shared types mirroring the backend Pydantic schemas. */

export type Currency = "som";

export type RecommendationSection =
  | "sizga_mos"
  | "yoqishi_mumkin"
  | "shu_dokondan"
  | "oxshash";

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: Currency;
  seller: string;
  color: string;
  sizes: string[];
  rating: number;
  delivery: string;
  category: string;
  description: string;
  image_url: string;
  tryon_image_url: string;
}

export interface RecommendedProduct extends Product {
  match_score: number;
  section: RecommendationSection;
}

export interface RecommendationsResponse {
  product_id: string;
  stylist_advice: string;
  sections: RecommendationSection[];
  products: RecommendedProduct[];
}

export interface ProfileData {
  height_cm: number;
  weight_kg: number;
  age_range: string;
  usual_size: string;
  body_type: string;
  style: string;
  occasion: string;
}

export interface ProfileUploadResponse {
  profile_id: string;
  photo_url: string;
}

export interface TryOnGenerateRequest {
  product_id: string;
  profile_id: string;
}

export interface TryOnResult {
  tryon_image_url: string;
  match_score: number;
  size_recommendation: string;
  color_match: string;
  advice: string;
  product: Product;
  recommended_products: RecommendedProduct[];
}

export interface MerchantKpi {
  tryon_count: number;
  new_leads: number;
  plan: string;
  remaining_limit: number;
}

export interface MerchantIntegration {
  api_widget: string;
  qr_link: string;
  marketplace: string;
}

export interface TrafficSource {
  source: string;
  visits: number;
  percent: number;
}

export interface TopProduct {
  product_id: string;
  name: string;
  tryons: number;
}

export interface InterestedCustomer {
  name: string;
  product: string;
  match_score: number;
  source: string;
}

export interface ConversionStats {
  tryon_to_lead: number;
  lead_to_order: number;
  overall: number;
}

export interface MerchantDashboard {
  store_name: string;
  kpis: MerchantKpi;
  integration: MerchantIntegration;
  traffic_sources: TrafficSource[];
  top_products: TopProduct[];
  interested_customers: InterestedCustomer[];
  conversion: ConversionStats;
  ai_advice: string;
}

export interface QrLinkStats {
  via_qr: number;
  via_link_tryon: number;
}

export interface QrLink {
  store_name: string;
  store_link: string;
  qr_image_url: string;
  instagram_bio_link: string;
  widget_embed_code: string;
  stats: QrLinkStats;
}

export interface LeadCreate {
  name: string;
  phone: string;
  product_id?: string | null;
  source?: string;
}

export interface Lead extends LeadCreate {
  id: string;
  created_at: string;
}

export interface OrderCreate {
  product_id: string;
  size: string;
  customer_name: string;
  customer_phone: string;
  address?: string | null;
}

export interface Order extends OrderCreate {
  id: string;
  status: string;
  message: string;
  created_at: string;
}

/** Normalized API error surfaced by the axios interceptor. */
export interface ApiError {
  status: number | null;
  message: string;
  detail?: unknown;
}
