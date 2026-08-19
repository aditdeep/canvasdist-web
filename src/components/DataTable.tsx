import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "./ui";

export type Column<T> = {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

export function DataTable<T extends { id: number | string }>({
  columns,
  rows,
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-[var(--color-ink-faint)]">
            {columns.map((c, i) => (
              <th key={i} className={`font-semibold pb-2.5 ${c.className ?? ""}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={`border-t border-white/50 ${onRowClick ? "cursor-pointer hover:bg-white/40" : ""} transition`}
            >
              {columns.map((c, i) => (
                <td key={i} className={`py-3 ${c.className ?? ""}`}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <GlassCard className="flex flex-col items-center text-center gap-2.5 py-12">
      <span className="w-12 h-12 rounded-2xl glass-pill grid place-items-center text-[var(--color-ink-faint)]">
        <Icon size={20} />
      </span>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-[var(--color-ink-soft)] max-w-xs">{description}</p>
    </GlassCard>
  );
}

export function LoadingRows() {
  return (
    <div className="space-y-2 py-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-11 rounded-xl bg-white/40 animate-pulse" />
      ))}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-danger)]/10 text-[var(--color-danger)] text-sm px-4 py-3">
      {message}
    </div>
  );
}
