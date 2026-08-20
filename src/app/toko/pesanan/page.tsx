"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Package, Check, Clock, Store, Truck } from "lucide-react";
import { GlassCard, GradientButton, Badge } from "@/components/ui";
import { api, fetcher, formatCurrency, formatDateTime } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Order, Paginated, OrderStatus } from "@/types";

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

function getSteps(order: Order): { label: string; done: boolean }[] {
  const statusOrder: OrderStatus[] = ["pending", "approved", "processing", "completed"];
  const currentIndex = statusOrder.indexOf(order.status === "shipped" ? "processing" : order.status);

  return [
    { label: "Pesanan Dibuat", done: currentIndex >= 0 },
    { label: "Dikonfirmasi Agen", done: currentIndex >= 1 },
    {
      label: order.fulfillment_type === "pickup" ? "Siap Diambil" : "Dikirim Kurir",
      done: currentIndex >= 2 || order.status === "shipped",
    },
    { label: order.fulfillment_type === "pickup" ? "Sudah Diambil" : "Diterima", done: order.status === "completed" },
  ];
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const steps = getSteps(order);
  const cancelled = order.status === "cancelled" || order.status === "returned";

  return (
    <GlassCard>
      <button onClick={() => setExpanded((e) => !e)} className="w-full flex items-center justify-between text-left">
        <div>
          <p className="text-xs font-mono text-[var(--color-ink-soft)]">{order.order_no}</p>
          <p className="text-[11px] text-[var(--color-ink-faint)] mt-0.5">{formatDateTime(order.created_at)}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end">
            <Badge tone={STATUS_TONE[order.status] ?? "neutral"}>{STATUS_LABEL[order.status] ?? order.status}</Badge>
            <Badge tone={order.payment_status === "paid" ? "success" : "warning"}>
              {order.payment_status === "paid" ? "Lunas" : "Belum Bayar"}
            </Badge>
          </div>
          <p className="text-sm font-bold text-[var(--color-ink)] mt-1">{formatCurrency(order.total)}</p>
        </div>
      </button>

      {expanded && !cancelled && (
        <div className="mt-4 pt-4 border-t border-white/60">
          <div className="flex items-center">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full grid place-items-center shrink-0 ${
                      step.done ? "bg-[var(--color-primary-1)] text-white" : "bg-white/60 text-[var(--color-ink-faint)]"
                    }`}
                  >
                    {step.done ? (
                      <Check size={14} />
                    ) : i === 2 ? (
                      order.fulfillment_type === "pickup" ? <Store size={13} /> : <Truck size={13} />
                    ) : (
                      <Clock size={13} />
                    )}
                  </div>
                  <span className="text-[9px] text-[var(--color-ink-soft)] text-center max-w-[64px] leading-tight">
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 mb-4 ${step.done ? "bg-[var(--color-primary-1)]" : "bg-white/60"}`} />
                )}
              </div>
            ))}
          </div>

          {order.fulfillment_type === "delivery" && order.delivery_order && (
            <p className="text-[11px] text-[var(--color-ink-soft)] mt-3 text-center">
              No. Surat Jalan: <span className="font-mono">{order.delivery_order.do_number}</span>
            </p>
          )}

          {order.items && order.items.length > 0 && (
            <div className="mt-4 space-y-1.5">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <span className="text-[var(--color-ink-soft)]">
                    {item.product?.name ?? `Produk #${item.product_id}`} x{item.qty}
                  </span>
                  <span className="text-[var(--color-ink)] font-medium">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {expanded && cancelled && (
        <p className="mt-4 pt-4 border-t border-white/60 text-xs text-[var(--color-ink-soft)] text-center">
          Pesanan ini {order.status === "cancelled" ? "dibatalkan" : "dikembalikan"}.
        </p>
      )}
    </GlassCard>
  );
}

export default function PesananPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: orders, isLoading, mutate } = useSWR<Paginated<Order>>(user ? "/orders" : null, fetcher);

  // Fallback: verifikasi aktif ke Duitku untuk order yang masih "belum bayar"
  // (bukan cuma nunggu webhook callback, yang kadang telat/gagal terkirim).
  useEffect(() => {
    if (!orders?.data) return;

    const pendingPayments = orders.data.filter(
      (o) => o.payment_method === "duitku" && o.payment_status === "unpaid" && o.status !== "cancelled"
    );

    if (pendingPayments.length === 0) return;

    Promise.all(
      pendingPayments.map((o) => {
        const reference = o.payment_transactions?.[o.payment_transactions.length - 1]?.reference;
        if (!reference) return Promise.resolve();
        return api.post("/payment/duitku/check-status", { reference }).catch(() => {});
      })
    ).then(() => mutate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders?.data?.length]);

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
      <div>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Pesanan Saya</h1>
        <p className="text-xs text-[var(--color-ink-soft)] mt-0.5">Ketuk pesanan untuk lihat status pengiriman.</p>
      </div>

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
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
