"use client";

import useSWR from "swr";
import { ClipboardList, Check } from "lucide-react";
import { GlassCard, GhostButton, Badge } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { api, fetcher, formatCurrency, formatDateTime } from "@/lib/api";
import type { Paginated, Order, OrderStatus } from "@/types";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Menunggu",
  approved: "Disetujui",
  processing: "Diproses",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  returned: "Retur",
};

const STATUS_TONE: Record<OrderStatus, "primary" | "success" | "warning" | "danger" | "neutral"> = {
  pending: "warning",
  approved: "primary",
  processing: "primary",
  shipped: "primary",
  completed: "success",
  cancelled: "danger",
  returned: "danger",
};

export default function OrderPage() {
  const { data, error, isLoading, mutate } = useSWR<Paginated<Order>>("/orders", fetcher);

  async function handleApprove(id: number) {
    try {
      await api.post(`/orders/${id}/approve`);
      mutate();
    } catch {
      // biarkan tabel tetap tampil, error ditangani lewat toast di iterasi berikutnya
    }
  }

  const rows = data?.data ?? [];

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Order</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Order dari canvasing, menunggu approval hingga selesai.</p>
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data order." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={ClipboardList} title="Belum ada order" description="Order dari sales/canvasser akan muncul di sini." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<Order>
            rows={rows}
            columns={[
              { header: "No. Order", render: (o) => <span className="font-[family-name:var(--font-jbmono)] text-xs">{o.order_no}</span> },
              { header: "Outlet", render: (o) => o.outlet?.name ?? `#${o.outlet_id}` },
              { header: "Total", render: (o) => <span className="font-semibold">{formatCurrency(o.total)}</span> },
              { header: "Tanggal", render: (o) => formatDateTime(o.created_at) },
              { header: "Status", render: (o) => <Badge tone={STATUS_TONE[o.status]}>{STATUS_LABEL[o.status]}</Badge> },
              {
                header: "",
                render: (o) =>
                  o.status === "pending" ? (
                    <GhostButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(o.id);
                      }}
                      className="!px-3 !py-1.5 text-xs"
                    >
                      <Check size={13} /> Approve
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
