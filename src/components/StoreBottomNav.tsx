"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Package, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const ITEMS = [
  { href: "/toko", label: "Beranda", icon: Home },
  { href: "/toko/keranjang", label: "Keranjang", icon: ShoppingCart },
  { href: "/toko/pesanan", label: "Pesanan", icon: Package },
  { href: "/toko/akun", label: "Akun", icon: User },
];

/**
 * Bottom nav ala app mobile — cuma tampil di layar kecil (md:hidden), jadi
 * pengalaman "app-like" ini otomatis aktif begitu situs dibuka di HP atau
 * di-install sebagai PWA, tanpa ganggu tampilan desktop yang sudah pakai
 * navbar atas.
 */
export function StoreBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-strong border-t border-white/60"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {ITEMS.map((item) => {
          const active = item.href === "/toko" ? pathname === "/toko" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 relative min-w-[56px]"
            >
              <div className="relative">
                <item.icon
                  size={20}
                  className={active ? "text-[var(--color-primary-1)]" : "text-[var(--color-ink-faint)]"}
                />
                {item.href === "/toko/keranjang" && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-[var(--color-danger)] text-white text-[9px] font-bold grid place-items-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-[var(--color-primary-1)]" : "text-[var(--color-ink-faint)]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
