"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, Users } from "lucide-react";
import { GlassCard, GradientButton, GlassInput, Badge } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { api, fetcher, ApiError } from "@/lib/api";
import { canWrite } from "@/lib/permissions";
import { useAuth } from "@/lib/auth-context";
import type { Paginated, User } from "@/types";

const ROLE_OPTIONS = [
  { value: "wilayah", label: "Wilayah" },
  { value: "agen", label: "Agen" },
  { value: "reseller", label: "Reseller" },
  { value: "sales", label: "Sales" },
  { value: "gudang", label: "Gudang" },
  { value: "kurir", label: "Kurir" },
];

const ROLE_TONE: Record<string, "primary" | "success" | "warning" | "danger" | "neutral"> = {
  super_admin: "danger",
  wilayah: "primary",
  agen: "primary",
  reseller: "success",
  sales: "warning",
  gudang: "neutral",
  kurir: "neutral",
};

export default function UserPage() {
  const { user: currentUser } = useAuth();
  const { data, error, isLoading, mutate } = useSWR<Paginated<User>>("/users", fetcher);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "sales" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await api.post("/users", form);
      setOpen(false);
      setForm({ name: "", email: "", phone: "", password: "", role: "sales" });
      mutate();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal menyimpan user");
    } finally {
      setSaving(false);
    }
  }

  const rows = data?.data ?? [];

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">User</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Kelola akun agen, sales, gudang, dan kurir.</p>
        </div>
        {canWrite("user", currentUser?.role) && (
          <GradientButton onClick={() => setOpen(true)} className="shrink-0">
            <Plus size={16} /> Tambah
          </GradientButton>
        )}
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data user." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={Users} title="Belum ada user" description="Tambahkan akun agen atau sales pertama kamu." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<User>
            rows={rows}
            columns={[
              { header: "Nama", render: (u) => <span className="font-medium">{u.name}</span> },
              { header: "Email", render: (u) => <span className="text-xs">{u.email}</span> },
              { header: "Role", render: (u) => <Badge tone={ROLE_TONE[u.role] ?? "neutral"}>{u.role}</Badge> },
              { header: "Status", render: (u) => <Badge tone={u.is_active ? "success" : "neutral"}>{u.is_active ? "Aktif" : "Nonaktif"}</Badge> },
            ]}
          />
        )}
      </GlassCard>

      <Modal open={open} onClose={() => setOpen(false)} title="Tambah User">
        <form onSubmit={handleSubmit} className="space-y-3">
          {formError && <ErrorState message={formError} />}
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Nama Lengkap</label>
            <GlassInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Email</label>
            <GlassInput type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Telepon</label>
            <GlassInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Password</label>
            <GlassInput type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Role</label>
            <select
              className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <GradientButton type="submit" className="w-full mt-2" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan User"}
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
}
