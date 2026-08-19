"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_NAV_ITEMS } from "@/lib/nav";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="glass-strong flex items-center justify-between px-2 py-2">
        {MOBILE_NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 flex-1 py-1.5 rounded-xl text-[10px] font-medium transition ${
                active ? "text-[var(--color-primary-1)]" : "text-[var(--color-ink-faint)]"
              }`}
            >
              <span
                className={`w-9 h-8 rounded-lg grid place-items-center transition ${active ? "bg-[var(--color-primary-1)]/12" : ""}`}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 2} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
