"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { GlassCard } from "@/components/ui";
import { navGroupsForRole } from "@/lib/nav";
import { useAuth } from "@/lib/auth-context";

export default function MenuPage() {
  const { user, logout } = useAuth();

  // Grup "Utama" (Dashboard) sudah ada di bottom nav sebagai "Home", jadi tidak perlu diulang di sini
  const groups = navGroupsForRole(user?.role ?? "reseller").filter((g) => g.title !== "Utama");

  return (
    <div className="max-w-lg mx-auto space-y-5 lg:hidden">
      <div>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Menu Lainnya</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Semua modul CanvasDist ada di sini.</p>
      </div>

      {user && (
        <GlassCard className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full grid place-items-center text-white text-sm font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2))" }}
          >
            {user.name
              .split(" ")
              .slice(0, 2)
              .map((s) => s[0])
              .join("")
              .toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-[var(--color-ink-soft)] truncate">{user.email}</p>
          </div>
        </GlassCard>
      )}

      {groups.map((group) => (
        <GlassCard key={group.title}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)] mb-2 px-1">
            {group.title}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-2.5 py-3 text-sm font-medium text-[var(--color-ink)] hover:bg-white/60 transition"
                >
                  <span className="w-9 h-9 rounded-lg glass-pill grid place-items-center text-[var(--color-primary-1)] shrink-0">
                    <Icon size={16} />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </GlassCard>
      ))}

      <button
        onClick={() => logout()}
        className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[var(--color-danger)] glass-pill hover:bg-white/80 transition"
      >
        <LogOut size={16} /> Keluar
      </button>
    </div>
  );
}
