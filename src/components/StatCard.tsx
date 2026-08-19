import type { ReactNode } from "react";
import { GlassCard } from "./ui";

export function StatCard({
  label,
  value,
  delta,
  deltaTone = "success",
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "success" | "danger";
  icon?: ReactNode;
}) {
  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--color-ink-soft)]">{label}</span>
        {icon && (
          <span className="w-8 h-8 rounded-lg glass-pill grid place-items-center text-[var(--color-primary-1)]">
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[var(--color-ink)]">
          {value}
        </span>
        {delta && (
          <span
            className={`text-xs font-semibold ${
              deltaTone === "success" ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
            }`}
          >
            {delta}
          </span>
        )}
      </div>
    </GlassCard>
  );
}
