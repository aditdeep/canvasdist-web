"use client";

import useSWR from "swr";
import { CreditCard } from "lucide-react";
import { GlassCard, Badge } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { fetcher, formatCurrency, formatDateTime } from "@/lib/api";
import type { Paginated, PaymentTransaction } from "@/types";

const STATUS_TONE: Record<PaymentTransaction["status"], "warning" | "success" | "danger" | "neutral"> = {
  pending: "warning",
  success: "success",
  failed: "danger",
  expired: "neutral",
};

const STATUS_LABEL: Record<PaymentTransaction["status"], string> = {
  pending: "Menunggu",
  success: "Berhasil",
  failed: "Gagal",
  expired: "Kedaluwarsa",
};

export default function PaymentPage() {
  const { data, error, isLoading } = useSWR<Paginated<PaymentTransaction>>("/payment/transactions", fetcher);
  const rows = data?.data ?? [];

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Payment Gateway</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">
          Riwayat transaksi via Duitku — top up saldo & pembayaran order (VA, e-wallet, QRIS).
        </p>
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat riwayat transaksi payment." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={CreditCard} title="Belum ada transaksi" description="Transaksi top up atau pembayaran akan muncul di sini." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<PaymentTransaction>
            rows={rows}
            columns={[
              { header: "Referensi", render: (t) => <span className="font-[family-name:var(--font-jbmono)] text-xs">{t.reference}</span> },
              { header: "Gateway", render: (t) => <span className="capitalize">{t.gateway}</span> },
              { header: "Jumlah", render: (t) => <span className="font-semibold">{formatCurrency(t.amount)}</span> },
              { header: "Waktu", render: (t) => formatDateTime(t.created_at) },
              { header: "Status", render: (t) => <Badge tone={STATUS_TONE[t.status]}>{STATUS_LABEL[t.status]}</Badge> },
            ]}
          />
        )}
      </GlassCard>
    </div>
  );
}
