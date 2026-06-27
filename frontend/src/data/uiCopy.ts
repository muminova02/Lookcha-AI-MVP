/** Reusable Uzbek (Latin) UI copy. Single source of truth for labels. */

import type { RecommendationSection } from "@/types";

export const brand = {
  name: "Lookcha AI",
} as const;

export const customerNav = {
  home: "Asosiy",
  search: "Qidiruv",
  tryOn: "Try-On",
  saved: "Saqlanganlar",
  profile: "Profil",
} as const;

export const merchantNav = {
  overview: "Umumiy",
  products: "Mahsulotlar",
  qrLink: "QR/Link",
  leads: "Leadlar",
  report: "Hisobot",
} as const;

export const buttons = {
  viewDemo: "Demo ko‘rish",
  startPartnership: "Hamkorlikni boshlash",
  tryOnLookcha: "Lookcha’da kiyib ko‘rish",
  startTryOn: "Kiyib ko‘rishni boshlash",
  seeAiResult: "AI natijani ko‘rish",
  placeOrder: "Buyurtma berish",
  tryAnother: "Boshqa kiyim sinash",
  save: "Saqlash",
  backToMarketplace: "Marketplace’ga qaytish",
  copyLink: "Linkni nusxalash",
  downloadQr: "QR kodni yuklab olish",
  backToDashboard: "Do‘kon paneliga qaytish",
  callStore: "Do‘konga qo‘ng‘iroq qilish",
  writeTelegram: "Telegramda yozish",
  addToCart: "Savatga qo‘shish",
  buyNow: "Hozir sotib olish",
} as const;

export const states = {
  loadingTryOn: "AI kiyimni sizga moslab ko‘rsatmoqda...",
  uploadError: "Rasm yuklanmadi. Qayta urinib ko‘ring.",
  halfBodyError:
    "Yarim rasm mos emas. AI kiyimni to‘liq ko‘rsatishi uchun boshdan oyoqqacha rasm yuklang.",
  noLeads: "Hali leadlar yo‘q. QR/link ulashib mijozlarni chaqiring.",
  orderSuccess: "Buyurtma qabul qilindi. Tez orada siz bilan bog‘lanamiz.",
  genericError: "Xatolik yuz berdi. Qayta urinib ko‘ring.",
  loading: "Yuklanmoqda...",
} as const;

export const sectionTitles: Record<RecommendationSection, string> = {
  sizga_mos: "Sizga mos",
  yoqishi_mumkin: "Yoqishi mumkin",
  shu_dokondan: "Shu do‘kondan yana",
  oxshash: "O‘xshash variantlar",
};

export const labels = {
  matchScore: "Moslik bahosi",
  sizeRecommendation: "Razmer tavsiyasi",
  colorMatch: "Rang mosligi",
  aiAdvice: "AI maslahat",
  aiMatch: "AI moslik",
  recommendationsTitle: "Sizga mos tavsiyalar",
} as const;
