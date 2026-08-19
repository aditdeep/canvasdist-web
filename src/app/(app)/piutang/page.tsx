"use client";

import useSWR from "swr";
import { FileBarChart } from "lucide-react";
import { GlassCard, Badge } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { fetcher, formatCurrency, formatDate } from "@/lib/api";
import type { Paginated, Invoice } from "@/types";

const STATUS_TONE: Record<Invoice["status"], "primary" | "success" | "danger"> = {
  unpaid: "primary",
  paid: "success",
  overdue: "danger",
};

const STATUS_LABEL: Record<Invoice["status"], string> = {
  unpaid: "Belum Bayar",
  paid: "Lunas",
  overdue: "Jatuh Tempo",
};

export default function PiutangPage() {
  const { data, error, isLoading } = useSWR<Paginated<Invoice>>("/invoices", fetcher);
  const rows = data?.data ?? [];

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Piutang & Pembayaran</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Invoice dan status pembayaran outlet.</p>
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data invoice." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={FileBarChart} title="Belum ada invoice" description="Invoice muncul otomatis setelah order selesai." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<Invoice>
            rows={rows}
            columns={[
              { header: "No. Invoice", render: (i) => <span className="font-[family-name:var(--font-jbmono)] text-xs">{i.invoice_no}</span> },
              { header: "Jumlah", render: (i) => <span className="font-semibold">{formatCurrency(i.amount)}</span> },
              { header: "Jatuh Tempo", render: (i) => formatDate(i.due_date) },
              { header: "Status", render: (i) => <Badge tone={STATUS_TONE[i.status]}>{STATUS_LABEL[i.status]}</Badge> },
            ]}
          />
        )}
      </GlassCard>
    </div>
  );
}
