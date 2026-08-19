"use client";

import { Bell, Search } from "lucide-react";

export function Topbar({ userName = "Agen Semarang", role = "Agen" }: { userName?: string; role?: string }) {
  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 lg:px-6">
      <div className="glass-strong flex items-center gap-3 px-4 py-3">
        <div className="hidden sm:flex items-center gap-2 flex-1 max-w-sm glass-pill px-3 py-2">
          <Search size={16} className="text-[var(--color-ink-faint)]" />
          <input
            placeholder="Cari outlet, order, produk..."
            className="bg-transparent outline-none text-sm placeholder:text-[var(--color-ink-faint)] w-full"
          />
        </div>

        <div className="flex-1 sm:hidden">
          <p className="font-[family-name:var(--font-manrope)] font-bold text-sm">CanvasDist</p>
        </div>

        <button
          aria-label="Notifikasi"
          className="w-9 h-9 rounded-full glass-pill grid place-items-center text-[var(--color-ink-soft)] hover:text-[var(--color-primary-1)] transition relative"
        >
          <Bell size={17} />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-[var(--color-danger)]" />
        </button>

        <div className="flex items-center gap-2 pl-1">
          <div
            className="w-9 h-9 rounded-full grid place-items-center text-white text-xs font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2))" }}
          >
            {initials}
          </div>
          <div className="hidden md:block leading-tight">
            <p className="text-[13px] font-semibold">{userName}</p>
            <p className="text-[11px] text-[var(--color-ink-soft)]">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
