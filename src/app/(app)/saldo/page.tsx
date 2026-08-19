"use client";

import { useState } from "react";
import useSWR from "swr";
import { ArrowDownLeft, ArrowUpRight, Gift, Recycle, RefreshCw } from "lucide-react";
import { GlassCard, GradientButton, Badge } from "@/components/ui";
import { EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { MemberCard } from "@/components/MemberCard";
import { api, fetcher, formatCurrency, formatDateTime, ApiError } from "@/lib/api";
import type { Paginated, Wallet, WalletMutation, MemberCard as MemberCardType } from "@/types";
import { useAuth } from "@/lib/auth-context";

const MUTATION_ICON: Record<WalletMutation["type"], typeof ArrowDownLeft> = {
  topup: ArrowDownLeft,
  payment: ArrowUpRight,
  commission: Gift,
  cashback: Recycle,
  refund: ArrowDownLeft,
};

const CREDIT_TYPES: WalletMutation["type"][] = ["topup", "commission", "cashback", "refund"];

export default function SaldoPage() {
  const { user } = useAuth();
  const { data: wallet } = useSWR<Wallet>("/wallet", fetcher);
  const { data: mutations, error, isLoading } = useSWR<Paginated<WalletMutation>>("/wallet/mutations", fetcher);
  const { data: card } = useSWR<MemberCardType>("/member-card", fetcher);

  const [amount, setAmount] = useState("");
  const [loadingTopup, setLoadingTopup] = useState(false);
  const [topupError, setTopupError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  async function handleTopup(value: number) {
    setLoadingTopup(true);
    setTopupError(null);
    setPaymentUrl(null);
    try {
      const res = await api.post<{ payment_url: string | null }>("/wallet/topup", { amount: value });
      if (res.payment_url) {
        setPaymentUrl(res.payment_url);
        window.open(res.payment_url, "_blank");
      }
    } catch (err) {
      setTopupError(err instanceof ApiError ? err.message : "Gagal memulai top up. Pastikan Duitku sudah dikonfigurasi.");
    } finally {
      setLoadingTopup(false);
    }
  }

  const rows = mutations?.data ?? [];

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Saldo</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">
          Top up, bayar order lebih cepat, dan lihat riwayat mutasi saldo kamu.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <MemberCard
            name={user?.name ?? "-"}
            level={card?.level ?? user?.role ?? "reseller"}
            cardNumber={card?.card_number ?? "•••• •••• •••• ••••"}
            balance={formatCurrency(wallet?.balance ?? 0)}
          />
          <GlassCard>
            <p className="text-xs text-[var(--color-ink-soft)] mb-3">Top up cepat</p>
            {topupError && <ErrorState message={topupError} />}
            <div className="grid grid-cols-3 gap-2 mb-3 mt-2">
              {[100000, 500000, 1000000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(String(v))}
                  className={`glass-pill py-2 text-xs font-semibold transition ${
                    amount === String(v) ? "text-[var(--color-primary-1)] bg-white/90" : "text-[var(--color-ink)] hover:bg-white/80"
                  }`}
                >
                  {v >= 1000000 ? `${v / 1000000}jt` : `${v / 1000}rb`}
                </button>
              ))}
            </div>
            <GradientButton
              className="w-full"
              disabled={loadingTopup || !amount}
              onClick={() => handleTopup(Number(amount))}
            >
              {loadingTopup ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Memproses...
                </>
              ) : (
                "Top Up via Duitku"
              )}
            </GradientButton>
            {paymentUrl && (
              <p className="text-[11px] text-[var(--color-success)] mt-2 text-center">
                Halaman pembayaran dibuka di tab baru. Saldo otomatis bertambah setelah pembayaran berhasil.
              </p>
            )}
            <p className="text-[11px] text-[var(--color-ink-faint)] mt-2 text-center">
              Bayar pakai saldo, dapat diskon tambahan untuk order tertentu.
            </p>
          </GlassCard>
        </div>

        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-manrope)] font-bold text-[15px]">Riwayat Mutasi</h2>
            <Badge tone="neutral">Terbaru</Badge>
          </div>

          {isLoading && <LoadingRows />}
          {error && <ErrorState message="Gagal memuat riwayat mutasi." />}
          {!isLoading && !error && rows.length === 0 && (
            <EmptyState icon={ArrowDownLeft} title="Belum ada mutasi" description="Top up pertama kamu akan muncul di sini." />
          )}

          <div className="space-y-1">
            {rows.map((m) => {
              const Icon = MUTATION_ICON[m.type];
              const isCredit = CREDIT_TYPES.includes(m.type);
              return (
                <div key={m.id} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/50 transition">
                  <span
                    className={`w-9 h-9 rounded-lg glass-pill grid place-items-center shrink-0 ${
                      isCredit ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--color-ink)] truncate">{m.description ?? m.type}</p>
                    <p className="text-[11px] text-[var(--color-ink-soft)]">{formatDateTime(m.created_at)}</p>
                  </div>
                  <span
                    className={`text-sm font-semibold font-[family-name:var(--font-jbmono)] ${
                      isCredit ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
                    }`}
                  >
                    {isCredit ? "+" : "-"}
                    {formatCurrency(m.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
