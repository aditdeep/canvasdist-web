"use client";

import useSWR from "swr";
import { StatCard } from "@/components/StatCard";
import { GlassCard, Badge } from "@/components/ui";
import { MemberCard } from "@/components/MemberCard";
import { LoadingRows, ErrorState, EmptyState } from "@/components/DataTable";
import { fetcher, formatCurrency, formatDateTime } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Paginated, Order, Commission, Wallet, MemberCard as MemberCardType } from "@/types";
import { Wallet2, ClipboardList, Network, TrendingUp, Activity } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useSWR<Paginated<Order>>("/orders", fetcher);
  const { data: commissions } = useSWR<Paginated<Commission>>("/commissions", fetcher);
  const { data: wallet } = useSWR<Wallet>("/wallet", fetcher);
  const { data: card } = useSWR<MemberCardType>("/member-card", fetcher);

  const activeOrders = (orders?.data ?? []).filter((o) => !["completed", "cancelled", "returned"].includes(o.status));
  const completedOrders = (orders?.data ?? []).filter((o) => o.status === "completed");
  const omzetBulanIni = completedOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
  const komisiPending = (commissions?.data ?? [])
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + parseFloat(c.amount), 0);

  const recentOrders = (orders?.data ?? []).slice(0, 5);

  return (
    <div className="space-y-5 max-w-7xl">
      <div>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[var(--color-ink)]">
          Selamat datang, {user?.name ?? "Pengguna"} 👋
        </h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Ini ringkasan aktivitas jaringan kamu hari ini.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Omzet Selesai" value={formatCurrency(omzetBulanIni)} icon={<TrendingUp size={16} />} />
        <StatCard label="Order Aktif" value={String(activeOrders.length)} icon={<ClipboardList size={16} />} />
        <StatCard label="Komisi Pending" value={formatCurrency(komisiPending)} icon={<Network size={16} />} />
        <StatCard label="Saldo Wallet" value={formatCurrency(wallet?.balance ?? 0)} icon={<Wallet2 size={16} />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-manrope)] font-bold text-[15px]">Order Terbaru</h2>
            <a href="/order" className="text-xs font-medium text-[var(--color-primary-1)]">
              Lihat semua
            </a>
          </div>

          {ordersLoading && <LoadingRows />}
          {ordersError && <ErrorState message="Gagal memuat order terbaru." />}
          {!ordersLoading && !ordersError && recentOrders.length === 0 && (
            <EmptyState icon={Activity} title="Belum ada aktivitas" description="Order dan kunjungan sales akan muncul di sini." />
          )}

          <div className="space-y-1">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/50 transition">
                <span className="w-9 h-9 rounded-lg glass-pill grid place-items-center text-[var(--color-primary-1)] shrink-0">
                  <ClipboardList size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--color-ink)] truncate">
                    Order {o.order_no} — {o.outlet?.name ?? "Outlet"}
                  </p>
                  <p className="text-[11px] text-[var(--color-ink-soft)]">{formatDateTime(o.created_at)}</p>
                </div>
                <Badge tone={o.status === "completed" ? "success" : o.status === "pending" ? "warning" : "primary"}>
                  {o.status}
                </Badge>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="flex flex-col gap-4">
          <GlassCard className="flex flex-col items-center gap-4">
            <p className="self-start font-[family-name:var(--font-manrope)] font-bold text-[15px]">Kartu Member Kamu</p>
            <MemberCard
              name={user?.name ?? "-"}
              level={card?.level ?? user?.role ?? "reseller"}
              cardNumber={card?.card_number ?? "•••• •••• •••• ••••"}
              balance={formatCurrency(wallet?.balance ?? 0)}
              compact
            />
            <a href="/saldo" className="self-stretch text-center text-xs font-semibold text-[var(--color-primary-1)] glass-pill py-2.5">
              Kelola Saldo →
            </a>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
