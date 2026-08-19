"use client";

import useSWR from "swr";
import { Truck, ChevronRight } from "lucide-react";
import { GlassCard, Badge, GhostButton } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { api, fetcher, formatDateTime } from "@/lib/api";
import type { Paginated, DeliveryOrder } from "@/types";

const STATUS_LABEL: Record<DeliveryOrder["status"], string> = {
  siap_kirim: "Siap Kirim",
  dikirim: "Dikirim",
  sampai_tujuan: "Sampai Tujuan",
  selesai: "Selesai",
};

const STATUS_TONE: Record<DeliveryOrder["status"], "primary" | "success" | "warning" | "neutral"> = {
  siap_kirim: "neutral",
  dikirim: "primary",
  sampai_tujuan: "warning",
  selesai: "success",
};

const NEXT_STATUS: Partial<Record<DeliveryOrder["status"], DeliveryOrder["status"]>> = {
  siap_kirim: "dikirim",
  dikirim: "sampai_tujuan",
};

export default function PengirimanPage() {
  const { data, error, isLoading, mutate } = useSWR<Paginated<DeliveryOrder>>("/delivery-orders", fetcher);

  async function advanceStatus(id: number, next: DeliveryOrder["status"]) {
    try {
      await api.put(`/delivery-orders/${id}`, { status: next });
      mutate();
    } catch {
      // ditangani via retry manual oleh user untuk saat ini
    }
  }

  const rows = data?.data ?? [];

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Pengiriman & Tracking</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Surat Jalan dan status kirim tiap order.</p>
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data pengiriman." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={Truck} title="Belum ada Surat Jalan" description="Surat Jalan dibuat otomatis saat order di-approve dari gudang." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<DeliveryOrder>
            rows={rows}
            columns={[
              { header: "No. DO", render: (d) => <span className="font-[family-name:var(--font-jbmono)] text-xs">{d.do_number}</span> },
              { header: "Outlet", render: (d) => d.order?.outlet?.name ?? "-" },
              { header: "Kurir", render: (d) => d.courier?.name ?? "Belum ditugaskan" },
              { header: "Dikirim", render: (d) => formatDateTime(d.shipped_at) },
              { header: "Status", render: (d) => <Badge tone={STATUS_TONE[d.status]}>{STATUS_LABEL[d.status]}</Badge> },
              {
                header: "",
                render: (d) =>
                  NEXT_STATUS[d.status] ? (
                    <GhostButton
                      onClick={(e) => {
                        e.stopPropagation();
                        advanceStatus(d.id, NEXT_STATUS[d.status]!);
                      }}
                      className="!px-3 !py-1.5 text-xs"
                    >
                      {STATUS_LABEL[NEXT_STATUS[d.status]!]} <ChevronRight size={13} />
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
