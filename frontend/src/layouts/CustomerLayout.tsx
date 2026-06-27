import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";

const navItems = [
  { to: "/", label: "Asosiy", icon: "🏠" },
  { to: "/recommendations", label: "Qidiruv", icon: "🔍" },
  { to: "/upload-profile", label: "Try-On", icon: "✨" },
  { to: "/tryon-result", label: "Saqlanganlar", icon: "❤️" },
  { to: "/order/premium-ipak-koylak", label: "Profil", icon: "👤" },
];

export interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="glass-header sticky top-0 z-40 border-b border-border/30">
        <div className="mx-auto flex max-w-app items-center justify-between px-5 py-3.5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-btn bg-primary text-sm text-on-primary">
              L
            </span>
            <span className="font-heading text-lg font-semibold tracking-tight">
              Lookcha AI
            </span>
          </Link>
          <Link
            to="/merchant/dashboard"
            className="text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            Hamkor uchun
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-app px-5 pb-28 pt-5">{children}</main>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border/40 bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-app items-stretch justify-between px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
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
