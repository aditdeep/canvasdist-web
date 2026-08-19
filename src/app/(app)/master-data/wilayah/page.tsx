"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, Map } from "lucide-react";
import { GlassCard, GradientButton, GlassInput } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { api, fetcher, ApiError } from "@/lib/api";
import type { Paginated, Region } from "@/types";

export default function WilayahPage() {
  const { data, error, isLoading, mutate } = useSWR<Paginated<Region>>("/regions", fetcher);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", code: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await api.post("/regions", form);
      setOpen(false);
      setForm({ name: "", code: "" });
      mutate();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal menyimpan wilayah");
    } finally {
      setSaving(false);
    }
  }

  const rows = data?.data ?? [];

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Wilayah</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Struktur wilayah distribusi.</p>
        </div>
        <GradientButton onClick={() => setOpen(true)} className="shrink-0">
          <Plus size={16} /> Tambah
        </GradientButton>
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data wilayah." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={Map} title="Belum ada wilayah" description="Tambahkan wilayah untuk mulai menyusun jaringan." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<Region>
            rows={rows}
            columns={[
              { header: "Nama Wilayah", render: (r) => <span className="font-medium">{r.name}</span> },
              { header: "Kode", render: (r) => <span className="font-[family-name:var(--font-jbmono)] text-xs">{r.code}</span> },
            ]}
          />
        )}
      </GlassCard>

      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Wilayah">
        <form onSubmit={handleSubmit} className="space-y-3">
          {formError && <ErrorState message={formError} />}
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Nama Wilayah</label>
            <GlassInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Kode</label>
            <GlassInput required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </div>
          <GradientButton type="submit" className="w-full mt-2" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Wilayah"}
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
}
