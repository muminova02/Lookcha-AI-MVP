import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";

const merchantNav = [
  { to: "/merchant/dashboard", label: "Umumiy", icon: "📊" },
  { to: "/merchant/dashboard", label: "Mahsulotlar", icon: "🛍️" },
  { to: "/merchant/qr-link", label: "QR/Link", icon: "🔗" },
  { to: "/merchant/dashboard", label: "Leadlar", icon: "👥" },
  { to: "/merchant/dashboard", label: "Hisobot", icon: "📈" },
];

export interface MerchantLayoutProps {
  children: ReactNode;
}

export default function MerchantLayout({ children }: MerchantLayoutProps) {
  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border/40 bg-surface lg:flex lg:flex-col">
        <Link to="/merchant/dashboard" className="flex items-center gap-2 px-6 py-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-btn bg-primary text-sm text-on-primary">
            L
          </span>
          <span className="font-heading text-lg font-semibold">Lookcha AI</span>
        </Link>
        <nav className="flex flex-col gap-1 px-3">
          {merchantNav.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-container/40 text-on-primary-container"
                    : "text-muted hover:bg-surface-container hover:text-ink",
                )
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-6 py-5">
          <Link to="/" className="text-sm text-muted hover:text-primary">
            Mijoz ko‘rinishi →
          </Link>
        </div>
      </aside>

      <div className="flex-1">
        {/* Mobile top bar */}
        <header className="glass-header sticky top-0 z-40 border-b border-border/30 lg:hidden">
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="font-heading text-lg font-semibold">Do‘kon paneli</span>
            <Link to="/" className="text-sm text-muted hover:text-primary">
              Mijoz ko‘rinishi
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-app px-5 pb-28 pt-5 lg:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border/40 bg-surface/95 backdrop-blur-md lg:hidden">
        <div className="flex items-stretch justify-between px-1">
          {merchantNav.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted hover:text-ink",
                )
              }
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
