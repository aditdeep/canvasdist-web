import type { LucideIcon } from "lucide-react";
import { GlassCard } from "./ui";

export function ModulePlaceholder({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[var(--color-ink)]">{title}</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">{description}</p>
      </div>
      <GlassCard className="flex flex-col items-center text-center gap-3 py-14">
        <span
          className="w-14 h-14 rounded-2xl grid place-items-center text-white"
          style={{ background: "linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2))" }}
        >
          <Icon size={24} />
        </span>
        <p className="font-[family-name:var(--font-manrope)] font-bold text-[15px] mt-1">Modul sedang disiapkan</p>
        <p className="text-sm text-[var(--color-ink-soft)] max-w-sm">
          Tampilan dan koneksi ke API untuk modul ini menyusul di tahap berikutnya.
        </p>
      </GlassCard>
    </div>
  );
}
