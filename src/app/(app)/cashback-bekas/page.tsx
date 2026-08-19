"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, Recycle, Check } from "lucide-react";
import { GlassCard, GradientButton, GlassInput, Badge, GhostButton } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { PhotoCapture } from "@/components/PhotoCapture";
import { api, fetcher, formatCurrency, ApiError } from "@/lib/api";
import type { Paginated, Buyback, Outlet } from "@/types";

const STATUS_TONE: Record<Buyback["status"], "warning" | "success" | "danger"> = {
  pending: "warning",
  verified: "success",
  rejected: "danger",
};

const STATUS_LABEL: Record<Buyback["status"], string> = {
  pending: "Menunggu",
  verified: "Terverifikasi",
  rejected: "Ditolak",
};

export default function CashbackBekasPage() {
  const { data, error, isLoading, mutate } = useSWR<Paginated<Buyback>>("/buyback", fetcher);
  const { data: outlets } = useSWR<Paginated<Outlet>>("/outlets", fetcher);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ outlet_id: "", item_type: "Jerigen 5L", qty: "", unit_price: "3000" });
  const [photo, setPhoto] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const formData = new FormData();
      formData.append("outlet_id", form.outlet_id);
      formData.append("item_type", form.item_type);
      formData.append("qty", form.qty);
      formData.append("unit_price", form.unit_price);
      if (photo) formData.append("photo", photo);

      await api.postForm("/buyback", formData);
      setOpen(false);
      setForm({ outlet_id: "", item_type: "Jerigen 5L", qty: "", unit_price: "3000" });
      setPhoto(null);
      mutate();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal menyimpan data buyback");
    } finally {
      setSaving(false);
    }
  }

  async function handleVerify(id: number) {
    try {
      await api.put(`/buyback/${id}`, { status: "verified" });
      mutate();
    } catch {
      // ditangani via retry manual
    }
  }

  const rows = data?.data ?? [];

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Cashback Barang Bekas</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Jerigen/kemasan bekas dari outlet, cashback otomatis ke saldo.</p>
        </div>
        <GradientButton onClick={() => setOpen(true)} className="shrink-0">
          <Plus size={16} /> Input Barang Bekas
        </GradientButton>
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data buyback." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={Recycle} title="Belum ada data" description="Input barang bekas pertama yang diterima dari outlet." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<Buyback>
            rows={rows}
            columns={[
              { header: "Outlet", render: (b) => b.outlet?.name ?? `#${b.outlet_id}` },
              { header: "Jenis", render: (b) => b.item_type },
              { header: "Qty", render: (b) => b.qty },
              { header: "Cashback", render: (b) => <span className="font-semibold">{formatCurrency(b.cashback_amount)}</span> },
              { header: "Status", render: (b) => <Badge tone={STATUS_TONE[b.status]}>{STATUS_LABEL[b.status]}</Badge> },
              {
                header: "",
                render: (b) =>
                  b.status === "pending" ? (
                    <GhostButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerify(b.id);
                      }}
                      className="!px-3 !py-1.5 text-xs"
                    >
                      <Check size={13} /> Verifikasi
                    </GhostButton>
                  ) : null,
              },
            ]}
          />
        )}
      </GlassCard>

      <Modal open={open} onClose={() => setOpen(false)} title="Input Barang Bekas">
        <form onSubmit={handleSubmit} className="space-y-3">
          {formError && <ErrorState message={formError} />}
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Outlet</label>
            <select
              required
              className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80"
              value={form.outlet_id}
              onChange={(e) => setForm({ ...form, outlet_id: e.target.value })}
            >
              <option value="">Pilih outlet...</option>
              {outlets?.data.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Jenis Barang</label>
            <GlassInput required value={form.item_type} onChange={(e) => setForm({ ...form, item_type: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Qty</label>
              <GlassInput type="number" required value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Harga/Unit</label>
              <GlassInput type="number" required value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Foto Barang (opsional)</label>
            <PhotoCapture onChange={setPhoto} label="Ambil foto barang bekas" />
          </div>
          <GradientButton type="submit" className="w-full mt-2" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
}
