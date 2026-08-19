"use client";

import { useState } from "react";
import useSWR from "swr";
import { Boxes, ArrowLeftRight } from "lucide-react";
import { GlassCard, GradientButton, GlassInput, Badge } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { api, fetcher, ApiError } from "@/lib/api";
import type { Paginated, Stock, Warehouse, Product } from "@/types";

export default function InventoryPage() {
  const { data, error, isLoading, mutate } = useSWR<Paginated<Stock>>("/stocks", fetcher);
  const { data: warehouses } = useSWR<Paginated<Warehouse>>("/warehouses", fetcher);
  const { data: products } = useSWR<Paginated<Product>>("/products", fetcher);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ to_warehouse_id: "", product_id: "", qty: "", type: "in" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await api.post("/stock-mutations", {
        to_warehouse_id: Number(form.to_warehouse_id),
        product_id: Number(form.product_id),
        qty: Number(form.qty),
        type: form.type,
      });
      setOpen(false);
      setForm({ to_warehouse_id: "", product_id: "", qty: "", type: "in" });
      mutate();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal mencatat mutasi stok");
    } finally {
      setSaving(false);
    }
  }

  const rows = data?.data ?? [];

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Inventory</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Stok produk per gudang.</p>
        </div>
        <GradientButton onClick={() => setOpen(true)} className="shrink-0">
          <ArrowLeftRight size={16} /> Mutasi Stok
        </GradientButton>
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data stok." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={Boxes} title="Belum ada data stok" description="Catat stok masuk pertama lewat tombol Mutasi Stok." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<Stock>
            rows={rows}
            columns={[
              { header: "Gudang", render: (s) => s.warehouse?.name ?? `#${s.warehouse_id}` },
              { header: "Produk", render: (s) => <span className="font-medium">{s.product?.name ?? `#${s.product_id}`}</span> },
              {
                header: "Qty",
                render: (s) => <Badge tone={s.qty > 0 ? "success" : "danger"}>{s.qty}</Badge>,
              },
            ]}
          />
        )}
      </GlassCard>

      <Modal open={open} onClose={() => setOpen(false)} title="Mutasi Stok">
        <form onSubmit={handleSubmit} className="space-y-3">
          {formError && <ErrorState message={formError} />}
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Tipe</label>
            <select
              className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="in">Stok Masuk</option>
              <option value="adjustment">Penyesuaian</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Gudang Tujuan</label>
            <select
              required
              className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80"
              value={form.to_warehouse_id}
              onChange={(e) => setForm({ ...form, to_warehouse_id: e.target.value })}
            >
              <option value="">Pilih gudang...</option>
              {warehouses?.data.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Produk</label>
            <select
              required
              className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80"
              value={form.product_id}
              onChange={(e) => setForm({ ...form, product_id: e.target.value })}
            >
              <option value="">Pilih produk...</option>
              {products?.data.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Qty</label>
            <GlassInput type="number" required value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
          </div>
          <GradientButton type="submit" className="w-full mt-2" disabled={saving}>
            {saving ? "Menyimpan..." : "Catat Mutasi"}
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
}
