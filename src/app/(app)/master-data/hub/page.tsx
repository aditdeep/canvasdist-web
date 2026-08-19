"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, Waypoints } from "lucide-react";
import { GlassCard, GradientButton, GlassInput, Badge } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { api, fetcher, ApiError } from "@/lib/api";
import type { Paginated, Hub, Warehouse, User } from "@/types";

const TYPE_LABEL: Record<Hub["type"], string> = {
  warehouse: "Gudang",
  agent_office: "Kantor Agen",
  custom: "Titik Custom",
};

export default function HubPage() {
  const { data, error, isLoading, mutate } = useSWR<Paginated<Hub>>("/hubs", fetcher);
  const { data: warehouses } = useSWR<Paginated<Warehouse>>("/warehouses", fetcher);
  const { data: users } = useSWR<Paginated<User>>("/users", fetcher);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", type: "custom" as Hub["type"], warehouse_id: "", agent_id: "", address: "" });

  const agents = (users?.data ?? []).filter((u) => u.role === "agen" || u.role === "wilayah");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await api.post("/hubs", {
        name: form.name,
        type: form.type,
        warehouse_id: form.type === "warehouse" ? Number(form.warehouse_id) : null,
        agent_id: form.type === "agent_office" ? Number(form.agent_id) : null,
        address: form.address || null,
      });
      setOpen(false);
      setForm({ name: "", type: "custom", warehouse_id: "", agent_id: "", address: "" });
      mutate();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal menyimpan hub");
    } finally {
      setSaving(false);
    }
  }

  const rows = data?.data ?? [];

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Hub</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">
            Titik transit (gudang/kantor agen) untuk rute pengiriman multi-hub.
          </p>
        </div>
        <GradientButton onClick={() => setOpen(true)} className="shrink-0">
          <Plus size={16} /> Tambah Hub
        </GradientButton>
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data hub." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState
            icon={Waypoints}
            title="Belum ada hub"
            description="Tambahkan hub pertama supaya bisa dipakai menyusun rute multi-etape."
          />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<Hub>
            rows={rows}
            columns={[
              { header: "Nama Hub", render: (h) => <span className="font-medium">{h.name}</span> },
              { header: "Tipe", render: (h) => <Badge tone="primary">{TYPE_LABEL[h.type]}</Badge> },
              { header: "Alamat", render: (h) => <span className="text-xs">{h.address || "-"}</span> },
            ]}
          />
        )}
      </GlassCard>

      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Hub">
        <form onSubmit={handleSubmit} className="space-y-3">
          {formError && <ErrorState message={formError} />}
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Nama Hub</label>
            <GlassInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Tipe Hub</label>
            <select
              className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as Hub["type"] })}
            >
              <option value="custom">Titik Custom (nama/alamat bebas)</option>
              <option value="warehouse">Gudang (dari data gudang yang ada)</option>
              <option value="agent_office">Kantor Agen (dari data agen/wilayah yang ada)</option>
            </select>
          </div>

          {form.type === "warehouse" && (
            <div>
              <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Pilih Gudang</label>
              <select
                required
                className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80"
                value={form.warehouse_id}
                onChange={(e) => setForm({ ...form, warehouse_id: e.target.value })}
              >
                <option value="">Pilih gudang...</option>
                {warehouses?.data.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.type === "agent_office" && (
            <div>
              <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Pilih Agen/Wilayah</label>
              <select
                required
                className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80"
                value={form.agent_id}
                onChange={(e) => setForm({ ...form, agent_id: e.target.value })}
              >
                <option value="">Pilih agen...</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Alamat (opsional)</label>
            <GlassInput value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>

          <GradientButton type="submit" className="w-full mt-2" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Hub"}
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
}
