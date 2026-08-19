"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, Tag } from "lucide-react";
import { GlassCard, GradientButton, GlassInput, Badge } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { api, fetcher, ApiError } from "@/lib/api";
import type { Paginated, Promo } from "@/types";

const TYPE_LABEL: Record<Promo["type"], string> = {
  discount_percent: "Diskon %",
  discount_fixed: "Diskon Tetap",
  tiered: "Berjenjang",
  points: "Poin Reward",
};

export default function PromoPage() {
  const { data, error, isLoading, mutate } = useSWR<Paginated<Promo>>("/promos", fetcher);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    type: "discount_percent",
    value: "",
    start_date: "",
    end_date: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await api.post("/promos", { ...form, value: parseFloat(form.value) });
      setOpen(false);
      setForm({ name: "", type: "discount_percent", value: "", start_date: "", end_date: "" });
      mutate();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal menyimpan promo");
    } finally {
      setSaving(false);
    }
  }

  const rows = data?.data ?? [];

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Promo, Diskon & Reward</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Kelola promo aktif untuk jaringan kamu.</p>
        </div>
        <GradientButton onClick={() => setOpen(true)} className="shrink-0">
          <Plus size={16} /> Buat Promo
        </GradientButton>
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data promo." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={Tag} title="Belum ada promo" description="Buat promo pertama untuk mendorong order lebih banyak." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<Promo>
            rows={rows}
            columns={[
              { header: "Nama Promo", render: (p) => <span className="font-medium">{p.name}</span> },
              { header: "Tipe", render: (p) => TYPE_LABEL[p.type] },
              { header: "Nilai", render: (p) => (p.type === "discount_percent" ? `${p.value}%` : p.value) },
              { header: "Periode", render: (p) => `${p.start_date} – ${p.end_date}` },
              { header: "Status", render: (p) => <Badge tone={p.is_active ? "success" : "neutral"}>{p.is_active ? "Aktif" : "Nonaktif"}</Badge> },
            ]}
          />
        )}
      </GlassCard>

      <Modal open={open} onClose={() => setOpen(false)} title="Buat Promo Baru">
        <form onSubmit={handleSubmit} className="space-y-3">
          {formError && <ErrorState message={formError} />}
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Nama Promo</label>
            <GlassInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Tipe</label>
            <select
              className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {Object.entries(TYPE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Nilai</label>
            <GlassInput type="number" required value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Mulai</label>
              <GlassInput type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Berakhir</label>
              <GlassInput type="date" required value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            </div>
          </div>
          <GradientButton type="submit" className="w-full mt-2" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Promo"}
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
}
