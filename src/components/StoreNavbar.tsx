"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useBranding } from "@/lib/use-branding";
import { imageUrl } from "@/lib/api";

function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(query ? `/toko?search=${encodeURIComponent(query)}` : "/toko");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 max-w-md">
      <div className="relative w-full">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari produk..."
          className="w-full rounded-full bg-white/50 border border-white/70 pl-9 pr-4 py-2 text-sm outline-none focus:bg-white/80 transition"
        />
      </div>
    </form>
  );
}

export function StoreNavbar() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const branding = useBranding();

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 lg:px-6">
      <div className="glass-strong flex items-center gap-3 px-4 py-3 max-w-6xl mx-auto">
        <Link href="/toko" className="flex items-center gap-2 shrink-0">
          {branding.logo_path ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl(branding.logo_path) ?? undefined} alt={branding.app_name} className="w-9 h-9 rounded-xl object-contain" />
          ) : (
            <span
              className="w-9 h-9 rounded-xl grid place-items-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2))" }}
            >
              {branding.app_name.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="font-[family-name:var(--font-manrope)] font-bold text-base hidden sm:inline">
            {branding.app_name}
          </span>
        </Link>

        <div className="flex-1 flex justify-center px-4">
          <Suspense fallback={null}>
            <SearchBox />
          </Suspense>
        </div>

        <Link
          href="/toko/keranjang"
          className="relative w-10 h-10 rounded-full glass-pill grid place-items-center text-[var(--color-ink-soft)] hover:text-[var(--color-primary-1)] transition"
        >
          <ShoppingCart size={18} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--color-danger)] text-white text-[10px] font-bold grid place-items-center">
              {totalItems}
            </span>
          )}
        </Link>

        {user ? (
          <Link
            href={user.role === "customer" ? "/toko/akun" : "/dashboard"}
            className="w-10 h-10 rounded-full glass-pill grid place-items-center text-[var(--color-ink-soft)] hover:text-[var(--color-primary-1)] transition"
          >
            <User size={18} />
          </Link>
        ) : (
          <Link href="/login" className="glass-pill px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
            Masuk
          </Link>
        )}
      </div>
    </header>
  );
}
