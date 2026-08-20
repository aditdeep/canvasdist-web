"use client";

import useSWR from "swr";
import Link from "next/link";
import { Package } from "lucide-react";
import { GlassCard, GradientButton, Badge } from "@/components/ui";
import { fetcher, formatCurrency, formatDateTime } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Order, Paginated } from "@/types";

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu Konfirmasi",
  approved: "Disetujui",
  processing: "Diproses",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  returned: "Dikembalikan",
};

const STATUS_TONE: Record<string, "primary" | "success" | "warning" | "danger" | "neutral"> = {
  pending: "warning",
  approved: "primary",
  processing: "primary",
  shipped: "primary",
  completed: "success",
  cancelled: "danger",
  returned: "danger",
};

export default function PesananPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: orders, isLoading } = useSWR<Paginated<Order>>(user ? "/orders" : null, fetcher);

  if (authLoading) {
    return <div className="h-64 rounded-2xl bg-white/40 animate-pulse max-w-2xl mx-auto" />;
  }

  if (!user) {
    return (
      <GlassCard className="max-w-md mx-auto text-center py-12">
        <p className="text-sm text-[var(--color-ink-soft)] mb-4">Masuk dulu untuk melihat riwayat pesananmu.</p>
        <Link href="/login?redirect=/toko/pesanan">
          <GradientButton>Masuk</GradientButton>
        </Link>
      </GlassCard>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Pesanan Saya</h1>

      {isLoading && <div className="h-40 rounded-2xl bg-white/40 animate-pulse" />}

      {!isLoading && (orders?.data.length ?? 0) === 0 && (
        <GlassCard className="text-center py-16 flex flex-col items-center gap-2">
          <Package size={28} className="text-[var(--color-ink-faint)]" />
          <p className="text-sm text-[var(--color-ink-soft)]">Belum ada pesanan.</p>
          <Link href="/toko">
            <GradientButton className="mt-2">Mulai Belanja</GradientButton>
          </Link>
        </GlassCard>
      )}

      {!isLoading && (orders?.data.length ?? 0) > 0 && (
        <div className="space-y-2">
          {orders!.data.map((order) => (
            <GlassCard key={order.id} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-[var(--color-ink-soft)]">{order.order_no}</p>
                <p className="text-[11px] text-[var(--color-ink-faint)] mt-0.5">{formatDateTime(order.created_at)}</p>
              </div>
              <div className="text-right">
                <Badge tone={STATUS_TONE[order.status] ?? "neutral"}>{STATUS_LABEL[order.status] ?? order.status}</Badge>
                <p className="text-sm font-bold text-[var(--color-ink)] mt-1">{formatCurrency(order.total)}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
