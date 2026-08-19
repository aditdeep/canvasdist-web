"use client";

import useSWR from "swr";
import { Network, Wallet2 } from "lucide-react";
import { GlassCard, Badge, GhostButton } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { api, fetcher, formatCurrency } from "@/lib/api";
import type { Paginated, Commission } from "@/types";

const LEVEL_LABEL: Record<Commission["level"], string> = {
  wilayah: "Wilayah",
  agen: "Agen",
  reseller: "Reseller",
};

export default function KomisiPage() {
  const { data, error, isLoading, mutate } = useSWR<Paginated<Commission>>("/commissions", fetcher);

  async function handlePayout(id: number) {
    try {
      await api.post(`/commissions/${id}/payout`);
      mutate();
    } catch {
      // ditangani via retry manual
    }
  }

  const rows = data?.data ?? [];
  const totalPending = rows.filter((c) => c.status === "pending").reduce((sum, c) => sum + parseFloat(c.amount), 0);

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Komisi Jaringan</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Komisi berjenjang wilayah, agen, dan reseller.</p>
        </div>
        <Badge tone="warning">Pending: {formatCurrency(totalPending)}</Badge>
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data komisi." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={Network} title="Belum ada komisi" description="Komisi tercatat otomatis saat order selesai dan terkirim." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<Commission>
            rows={rows}
            columns={[
              { header: "Level", render: (c) => LEVEL_LABEL[c.level] },
              { header: "Persentase", render: (c) => `${c.percentage}%` },
              { header: "Jumlah", render: (c) => <span className="font-semibold">{formatCurrency(c.amount)}</span> },
              { header: "Status", render: (c) => <Badge tone={c.status === "paid" ? "success" : "warning"}>{c.status === "paid" ? "Cair" : "Pending"}</Badge> },
              {
                header: "",
                render: (c) =>
                  c.status === "pending" ? (
                    <GhostButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePayout(c.id);
                      }}
                      className="!px-3 !py-1.5 text-xs"
                    >
                      <Wallet2 size={13} /> Cairkan
                    </GhostButton>
                  ) : null,
              },
            ]}
          />
        )}
      </GlassCard>
    </div>
  );
}
