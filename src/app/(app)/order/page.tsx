"use client";

import { useState } from "react";
import useSWR from "swr";
import { ClipboardList, Check, Truck, Store, Package, MapPin, AlertTriangle } from "lucide-react";
import { GlassCard, GhostButton, GradientButton, Badge } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
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
  const [detailId, setDetailId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: detail } = useSWR<Order>(detailId ? `/orders/${detailId}` : null, fetcher);

  async function handleApprove(id: number) {
    setActionLoading(true);
    setActionError(null);
    try {
      await api.post(`/orders/${id}/approve`);
      mutate();
    } catch {
      setActionError("Gagal approve order.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCompletePickup(id: number) {
    setActionLoading(true);
    setActionError(null);
    try {
      await api.post(`/orders/${id}/complete-pickup`);
      mutate();
      setDetailId(null);
    } catch {
      setActionError("Gagal menandai order sebagai diambil.");
    } finally {
      setActionLoading(false);
    }
  }

  const rows = data?.data ?? [];

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Order</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">
          Order dari canvasing maupun storefront customer. Klik baris untuk lihat detail barang.
        </p>
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data order." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={ClipboardList} title="Belum ada order" description="Order dari sales/canvasser atau storefront akan muncul di sini." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<Order>
            rows={rows}
            onRowClick={(o) => {
              setDetailId(o.id);
              setActionError(null);
            }}
            columns={[
              { header: "No. Order", render: (o) => <span className="font-[family-name:var(--font-jbmono)] text-xs">{o.order_no}</span> },
              { header: "Outlet", render: (o) => o.outlet?.name ?? `#${o.outlet_id}` },
              {
                header: "Sumber",
                render: (o) => (o.is_storefront_order ? <Badge tone="primary">Storefront</Badge> : <Badge tone="neutral">Canvasing</Badge>),
              },
              {
                header: "Cara Terima",
                render: (o) =>
                  o.fulfillment_type === "pickup" ? (
                    <span className="flex items-center gap-1 text-xs"><Store size={12} /> Ambil Sendiri</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs"><Truck size={12} /> Diantar</span>
                  ),
              },
              { header: "Total", render: (o) => <span className="font-semibold">{formatCurrency(o.total)}</span> },
              { header: "Bayar", render: (o) => <Badge tone={o.payment_status === "paid" ? "success" : "warning"}>{o.payment_status === "paid" ? "Lunas" : "Belum"}</Badge> },
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

      <Modal open={detailId !== null} onClose={() => setDetailId(null)} title={detail ? `Order ${detail.order_no}` : "Detail Order"}>
        {!detail ? (
          <div className="h-40 rounded-xl bg-white/40 animate-pulse" />
        ) : (
          <div className="space-y-4">
            {actionError && <ErrorState message={actionError} />}

            <div className="flex items-center gap-2 flex-wrap">
              <Badge tone={STATUS_TONE[detail.status]}>{STATUS_LABEL[detail.status]}</Badge>
              <Badge tone={detail.payment_status === "paid" ? "success" : "warning"}>
                {detail.payment_status === "paid" ? "Lunas" : "Belum Dibayar"}
              </Badge>
              {detail.is_storefront_order && <Badge tone="primary">Storefront</Badge>}
            </div>

            {!detail.agent_id ? (
              <div className="flex items-start gap-2 bg-[var(--color-danger)]/10 rounded-xl px-3 py-2.5">
                <AlertTriangle size={16} className="text-[var(--color-danger)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-[var(--color-danger)]">Belum ada agen yang bertanggung jawab</p>
                  <p className="text-[11px] text-[var(--color-ink-soft)] mt-0.5">
                    Kemungkinan besar tidak ada agen aktif di wilayah customer ini saat mendaftar. Order tetap bisa
                    diproses manual, tapi tidak akan menghasilkan komisi jaringan dan stok tidak otomatis terpotong
                    dari gudang manapun.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[var(--color-ink-soft)]">
                Agen penanggung jawab: <span className="font-semibold text-[var(--color-ink)]">{detail.agent?.name ?? `#${detail.agent_id}`}</span>
              </p>
            )}

            <div>
              <p className="text-xs font-semibold text-[var(--color-ink-soft)] mb-2">Barang Dipesan</p>
              <div className="space-y-1.5">
                {detail.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white/40 rounded-xl px-3 py-2 text-sm">
                    <span>
                      {item.product?.name ?? `Produk #${item.product_id}`}{" "}
                      <span className="text-[var(--color-ink-faint)]">x{item.qty}</span>
                    </span>
                    <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/60">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-base font-bold text-[var(--color-primary-1)]">{formatCurrency(detail.total)}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-white/40 rounded-xl px-3 py-2.5">
              {detail.fulfillment_type === "pickup" ? (
                <Store size={16} className="text-[var(--color-primary-1)] mt-0.5 shrink-0" />
              ) : (
                <Truck size={16} className="text-[var(--color-primary-1)] mt-0.5 shrink-0" />
              )}
              <div>
                <p className="text-xs font-semibold text-[var(--color-ink)]">
                  {detail.fulfillment_type === "pickup" ? "Ambil Sendiri di Outlet" : "Diantar Kurir"}
                </p>
                {detail.outlet?.address && (
                  <p className="text-xs text-[var(--color-ink-soft)] mt-0.5 flex items-start gap-1">
                    <MapPin size={12} className="mt-0.5 shrink-0" /> {detail.outlet.address}
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs text-[var(--color-ink-faint)]">{formatDateTime(detail.created_at)}</p>

            {detail.status === "pending" && (
              <GradientButton className="w-full" onClick={() => handleApprove(detail.id)} disabled={actionLoading}>
                <Check size={16} /> Approve Order
              </GradientButton>
            )}

            {detail.status === "approved" && detail.fulfillment_type === "pickup" && (
              <GradientButton className="w-full" onClick={() => handleCompletePickup(detail.id)} disabled={actionLoading}>
                <Package size={16} /> Tandai Sudah Diambil
              </GradientButton>
            )}

            {detail.status === "approved" && detail.fulfillment_type === "delivery" && (
              <p className="text-xs text-[var(--color-ink-soft)] bg-white/40 rounded-xl px-3 py-2.5">
                Lanjutkan ke halaman <strong>Pengiriman</strong> untuk membuat Surat Jalan dan menugaskan kurir.
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
