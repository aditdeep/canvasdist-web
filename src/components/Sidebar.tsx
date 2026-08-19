"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS } from "@/lib/nav";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[248px] shrink-0 h-screen sticky top-0 p-4">
      <div className="glass flex flex-col h-full p-4 overflow-hidden">
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-2 mb-4">
          <span
            className="w-8 h-8 rounded-lg grid place-items-center text-white font-bold text-sm shrink-0"
            style={{ background: "linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2))" }}
          >
            C
          </span>
          <span className="font-[family-name:var(--font-manrope)] font-bold text-[15px]">CanvasDist</span>
        </Link>

        <nav className="flex-1 overflow-y-auto pr-1 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium transition ${
                        active
                          ? "text-white shadow-[0_4px_16px_rgba(91,95,240,0.35)]"
                          : "text-[var(--color-ink-soft)] hover:bg-white/60 hover:text-[var(--color-ink)]"
                      }`}
                      style={
                        active
                          ? { background: "linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2))" }
                          : undefined
                      }
                    >
                      <Icon size={16} strokeWidth={2} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
