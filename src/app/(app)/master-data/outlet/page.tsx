"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, Store } from "lucide-react";
import { GlassCard, GradientButton, GlassInput } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { api, fetcher, ApiError } from "@/lib/api";
import type { Paginated, Outlet } from "@/types";

export default function OutletPage() {
  const { data, error, isLoading, mutate } = useSWR<Paginated<Outlet>>("/outlets", fetcher);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", owner_name: "", phone: "", address: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await api.post("/outlets", form);
      setOpen(false);
      setForm({ name: "", owner_name: "", phone: "", address: "" });
      mutate();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal menyimpan outlet");
    } finally {
      setSaving(false);
    }
  }

  const rows = data?.data ?? [];

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Outlet</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Data toko/customer di jaringan kamu.</p>
        </div>
        <GradientButton onClick={() => setOpen(true)} className="shrink-0">
          <Plus size={16} /> Tambah
        </GradientButton>
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data outlet." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={Store} title="Belum ada outlet" description="Tambahkan outlet pertama untuk mulai canvasing." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<Outlet>
            rows={rows}
            columns={[
              { header: "Nama Toko", render: (o) => <span className="font-medium">{o.name}</span> },
              { header: "Pemilik", render: (o) => o.owner_name || "-" },
              { header: "Telepon", render: (o) => o.phone || "-" },
              { header: "Alamat", render: (o) => <span className="text-xs">{o.address || "-"}</span> },
            ]}
          />
        )}
      </GlassCard>

      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Outlet">
        <form onSubmit={handleSubmit} className="space-y-3">
          {formError && <ErrorState message={formError} />}
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Nama Toko</label>
            <GlassInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Nama Pemilik</label>
            <GlassInput value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Telepon</label>
            <GlassInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Alamat</label>
            <GlassInput value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <GradientButton type="submit" className="w-full mt-2" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Outlet"}
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
}
