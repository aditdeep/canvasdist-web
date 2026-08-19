"use client";

import useSWR from "swr";
import { TrendingUp, ClipboardCheck, Network, Recycle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { GlassCard, Badge } from "@/components/ui";
import { LoadingRows, ErrorState, EmptyState } from "@/components/DataTable";
import { fetcher, formatCurrency } from "@/lib/api";
import type { Paginated, Order, Commission, Buyback } from "@/types";
import { FileBarChart } from "lucide-react";

export default function LaporanPage() {
  const { data: orders, error: ordersError, isLoading: ordersLoading } = useSWR<Paginated<Order>>("/orders", fetcher);
  const { data: commissions, error: commError, isLoading: commLoading } = useSWR<Paginated<Commission>>(
    "/commissions",
    fetcher
  );
  const { data: buyback, error: buybackError, isLoading: buybackLoading } = useSWR<Paginated<Buyback>>(
    "/buyback",
    fetcher
  );

  const loading = ordersLoading || commLoading || buybackLoading;
  const anyError = ordersError || commError || buybackError;

  const completedOrders = orders?.data.filter((o) => o.status === "completed") ?? [];
  const totalOmzet = completedOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
  const totalKomisiCair = (commissions?.data ?? []).filter((c) => c.status === "paid").reduce((sum, c) => sum + parseFloat(c.amount), 0);
  const totalCashback = (buyback?.data ?? []).filter((b) => b.status === "verified").reduce((sum, b) => sum + parseFloat(b.cashback_amount), 0);

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Laporan</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Ringkasan performa order, komisi, dan program cashback.</p>
      </div>

      {loading && <LoadingRows />}
      {anyError && <ErrorState message="Gagal memuat sebagian data laporan." />}

      {!loading && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Omzet Selesai" value={formatCurrency(totalOmzet)} icon={<TrendingUp size={16} />} />
            <StatCard label="Order Selesai" value={String(completedOrders.length)} icon={<ClipboardCheck size={16} />} />
            <StatCard label="Komisi Tercairkan" value={formatCurrency(totalKomisiCair)} icon={<Network size={16} />} />
            <StatCard label="Cashback Terverifikasi" value={formatCurrency(totalCashback)} icon={<Recycle size={16} />} />
          </div>

          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-[family-name:var(--font-manrope)] font-bold text-[15px]">Order Terbaru</h2>
              <Badge tone="neutral">{orders?.data.length ?? 0} order</Badge>
            </div>
            {(orders?.data.length ?? 0) === 0 ? (
              <EmptyState icon={FileBarChart} title="Belum ada data" description="Laporan akan terisi seiring order masuk." />
            ) : (
              <div className="space-y-1">
                {(orders?.data ?? []).slice(0, 8).map((o) => (
                  <div key={o.id} className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-white/50 transition">
                    <div className="min-w-0">
                      <p className="text-sm font-[family-name:var(--font-jbmono)]">{o.order_no}</p>
                      <p className="text-[11px] text-[var(--color-ink-soft)]">{o.outlet?.name ?? "-"}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatCurrency(o.total)}</span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </>
      )}
    </div>
  );
}
