"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, Store, CheckCircle2 } from "lucide-react";
import { GlassCard, GradientButton, Badge } from "@/components/ui";
import { api, formatCurrency, ApiError } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import type { Order } from "@/types";

export default function CheckoutPage() {
  const { items, totalPrice, clear } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/toko/checkout");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!authLoading && user && items.length === 0 && !successOrder) {
      router.replace("/toko/keranjang");
    }
  }, [authLoading, user, items.length, successOrder, router]);

  async function handleSubmit() {
    setSaving(true);
    setError(null);
    try {
      const order = await api.post<Order>("/orders", {
        fulfillment_type: fulfillment,
        payment_method: "cash",
        items: items.map((i) => ({ product_id: i.product.id, qty: i.qty })),
      });
      setSuccessOrder(order);
      clear();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal membuat pesanan, coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  if (successOrder) {
    return (
      <GlassCard className="max-w-md mx-auto text-center py-12 flex flex-col items-center gap-3">
        <CheckCircle2 size={40} className="text-[var(--color-success)]" />
        <h1 className="font-[family-name:var(--font-manrope)] text-lg font-bold">Pesanan Berhasil Dibuat!</h1>
        <p className="text-sm text-[var(--color-ink-soft)]">
          Nomor pesanan: <span className="font-mono font-semibold">{successOrder.order_no}</span>
        </p>
        <p className="text-xs text-[var(--color-ink-faint)] max-w-xs">
          Agen akan segera memproses pesananmu. Kamu bisa pantau statusnya di halaman akun.
        </p>
        <GradientButton className="mt-2" onClick={() => router.push("/toko")}>
          Kembali Belanja
        </GradientButton>
      </GlassCard>
    );
  }

  if (authLoading || !user || items.length === 0) {
    return <div className="h-64 rounded-2xl bg-white/40 animate-pulse max-w-2xl mx-auto" />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Checkout</h1>

      {error && (
        <div className="rounded-xl bg-[var(--color-danger)]/10 text-[var(--color-danger)] text-sm px-4 py-3">{error}</div>
      )}

      <GlassCard>
        <h2 className="font-semibold text-sm mb-3">Ringkasan Pesanan</h2>
        <div className="space-y-2">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-ink)]">
                {product.name} <span className="text-[var(--color-ink-faint)]">x{qty}</span>
              </span>
              <span className="font-medium">{formatCurrency(Number(product.display_price ?? product.base_price) * qty)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-white/60 mt-3 pt-3 flex items-center justify-between">
          <span className="text-sm font-semibold">Total</span>
          <span className="text-lg font-bold text-[var(--color-primary-1)]">{formatCurrency(totalPrice)}</span>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="font-semibold text-sm mb-3">Cara Terima Pesanan</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setFulfillment("delivery")}
            className={`rounded-xl p-4 text-left transition ${
              fulfillment === "delivery" ? "bg-white/90 border-2 border-[var(--color-primary-1)]" : "glass-pill border-2 border-transparent"
            }`}
          >
            <Truck size={20} className="text-[var(--color-primary-1)] mb-2" />
            <p className="text-sm font-semibold">Diantar</p>
            <p className="text-[11px] text-[var(--color-ink-soft)]">Dikirim oleh kurir ke alamatmu</p>
          </button>
          <button
            onClick={() => setFulfillment("pickup")}
            className={`rounded-xl p-4 text-left transition ${
              fulfillment === "pickup" ? "bg-white/90 border-2 border-[var(--color-primary-1)]" : "glass-pill border-2 border-transparent"
            }`}
          >
            <Store size={20} className="text-[var(--color-primary-1)] mb-2" />
            <p className="text-sm font-semibold">Ambil Sendiri</p>
            <p className="text-[11px] text-[var(--color-ink-soft)]">Ambil langsung di outlet agen</p>
          </button>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-sm">Metode Pembayaran</h2>
          <Badge tone="neutral">Bayar di tempat (COD)</Badge>
        </div>
        <p className="text-xs text-[var(--color-ink-soft)]">
          Pembayaran online (saldo/transfer) bisa dipilih setelah pesanan dikonfirmasi agen.
        </p>
      </GlassCard>

      <GradientButton className="w-full" onClick={handleSubmit} disabled={saving}>
        {saving ? "Memproses..." : `Buat Pesanan — ${formatCurrency(totalPrice)}`}
      </GradientButton>
    </div>
  );
}
