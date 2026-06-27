import { useRoutes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import ProductPage from "@/pages/ProductPage";
import UploadProfilePage from "@/pages/UploadProfilePage";
import TryOnResultPage from "@/pages/TryOnResultPage";
import RecommendationsPage from "@/pages/RecommendationsPage";
import OrderPage from "@/pages/OrderPage";
import MerchantDashboardPage from "@/pages/MerchantDashboardPage";
import QrLinkPage from "@/pages/QrLinkPage";

export default function AppRouter() {
  return useRoutes([
    { path: "/", element: <LandingPage /> },
    { path: "/product/:id", element: <ProductPage /> },
    { path: "/upload-profile", element: <UploadProfilePage /> },
    { path: "/tryon-result", element: <TryOnResultPage /> },
    { path: "/recommendations", element: <RecommendationsPage /> },
    { path: "/order/:id", element: <OrderPage /> },
    { path: "/merchant/dashboard", element: <MerchantDashboardPage /> },
    { path: "/merchant/qr-link", element: <QrLinkPage /> },
    { path: "*", element: <LandingPage /> },
  ]);
}
