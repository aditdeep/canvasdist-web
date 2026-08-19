"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, Package } from "lucide-react";
import { GlassCard, GradientButton, GlassInput, Badge } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { api, fetcher, formatCurrency, ApiError } from "@/lib/api";
import { canWrite } from "@/lib/permissions";
import { useAuth } from "@/lib/auth-context";
import type { Paginated, Product } from "@/types";

export default function ProdukPage() {
  const { user } = useAuth();
  const { data, error, isLoading, mutate } = useSWR<Paginated<Product>>("/products", fetcher);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", sku: "", category: "", unit: "pcs", base_price: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await api.post("/products", { ...form, base_price: parseFloat(form.base_price) });
      setOpen(false);
      setForm({ name: "", sku: "", category: "", unit: "pcs", base_price: "" });
      mutate();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal menyimpan produk");
    } finally {
      setSaving(false);
    }
  }

  const rows = data?.data ?? [];

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Produk</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Katalog produk dan harga dasar.</p>
        </div>
        {canWrite("produk", user?.role) && (
          <GradientButton onClick={() => setOpen(true)} className="shrink-0">
            <Plus size={16} /> Tambah
          </GradientButton>
        )}
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data produk. Pastikan API sudah jalan & dikonfigurasi." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={Package} title="Belum ada produk" description="Tambahkan produk pertama kamu untuk mulai jualan." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<Product>
            rows={rows}
            columns={[
              { header: "Nama", render: (p) => <span className="font-medium">{p.name}</span> },
              { header: "SKU", render: (p) => <span className="font-[family-name:var(--font-jbmono)] text-xs">{p.sku}</span> },
              { header: "Kategori", render: (p) => p.category || "-" },
              { header: "Harga Dasar", render: (p) => formatCurrency(p.base_price) },
              { header: "Status", render: (p) => <Badge tone={p.is_active ? "success" : "neutral"}>{p.is_active ? "Aktif" : "Nonaktif"}</Badge> },
            ]}
          />
        )}
      </GlassCard>

      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Produk">
        <form onSubmit={handleSubmit} className="space-y-3">
          {formError && <ErrorState message={formError} />}
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Nama Produk</label>
            <GlassInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">SKU</label>
            <GlassInput required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Kategori</label>
            <GlassInput value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Satuan</label>
              <GlassInput value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Harga Dasar</label>
              <GlassInput
                type="number"
                required
                value={form.base_price}
                onChange={(e) => setForm({ ...form, base_price: e.target.value })}
              />
            </div>
          </div>
          <GradientButton type="submit" className="w-full mt-2" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Produk"}
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
}
