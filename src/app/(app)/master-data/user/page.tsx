"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { Plus, Users, Truck } from "lucide-react";
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

const EMPTY_CREATE_FORM = { name: "", email: "", phone: "", password: "", role: "sales" };
const EMPTY_EDIT_FORM = {
  name: "",
  phone: "",
  role: "sales",
  is_active: true,
  shipping_fee: "0",
  courier_fee_flat: "0",
  courier_fee_percent: "0",
};

export default function UserPage() {
  const { user: currentUser } = useAuth();
  const { data, error, isLoading, mutate } = useSWR<Paginated<User>>("/users", fetcher);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);

  const canEdit = canWrite("user", currentUser?.role);

  useEffect(() => {
    if (editing) {
      const e = editing as User & { shipping_fee?: string; courier_fee_flat?: string; courier_fee_percent?: string };
      setEditForm({
        name: e.name,
        phone: e.phone ?? "",
        role: e.role,
        is_active: e.is_active,
        shipping_fee: String(e.shipping_fee ?? "0"),
        courier_fee_flat: String(e.courier_fee_flat ?? "0"),
        courier_fee_percent: String(e.courier_fee_percent ?? "0"),
      });
    }
  }, [editing]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await api.post("/users", createForm);
      setCreateOpen(false);
      setCreateForm(EMPTY_CREATE_FORM);
      mutate();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal menyimpan user");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setFormError(null);
    try {
      await api.put(`/users/${editing.id}`, editForm);
      setEditing(null);
      mutate();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal menyimpan perubahan");
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
        {canEdit && (
          <GradientButton onClick={() => setCreateOpen(true)} className="shrink-0">
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
            onRowClick={canEdit ? (u) => setEditing(u) : undefined}
            columns={[
              { header: "Nama", render: (u) => <span className="font-medium">{u.name}</span> },
              { header: "Email", render: (u) => <span className="text-xs">{u.email}</span> },
              { header: "Role", render: (u) => <Badge tone={ROLE_TONE[u.role] ?? "neutral"}>{u.role}</Badge> },
              { header: "Status", render: (u) => <Badge tone={u.is_active ? "success" : "neutral"}>{u.is_active ? "Aktif" : "Nonaktif"}</Badge> },
            ]}
          />
        )}
      </GlassCard>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Tambah User">
        <form onSubmit={handleCreate} className="space-y-3">
          {formError && <ErrorState message={formError} />}
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Nama Lengkap</label>
            <GlassInput required value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Email</label>
            <GlassInput type="email" required value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Telepon</label>
            <GlassInput value={createForm.phone} onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Password</label>
            <GlassInput type="password" required value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Role</label>
            <select
              className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80"
              value={createForm.role}
              onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
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

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing ? `Edit ${editing.name}` : "Edit User"}>
        <form onSubmit={handleUpdate} className="space-y-3">
          {formError && <ErrorState message={formError} />}
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Nama Lengkap</label>
            <GlassInput required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Telepon</label>
            <GlassInput value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Role</label>
            <select
              className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80"
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={editForm.is_active}
              onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
            />
            <label htmlFor="is_active" className="text-xs text-[var(--color-ink-soft)]">
              Akun aktif
            </label>
          </div>

          {editForm.role === "agen" && (
            <div className="bg-white/40 rounded-xl p-3 mt-2">
              <p className="text-xs font-semibold text-[var(--color-ink)] mb-2 flex items-center gap-1.5">
                <Truck size={13} /> Pengaturan Ongkir &amp; Kurir
              </p>
              <p className="text-[10px] text-[var(--color-ink-faint)] mb-2">
                Fee kurir bisa nominal tetap, persentase dari ongkir, atau digabung keduanya. Kosongkan/0 untuk
                menonaktifkan salah satu.
              </p>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-medium text-[var(--color-ink-soft)] mb-1 block">
                    Ongkir yang dikenakan ke customer (Rp)
                  </label>
                  <GlassInput
                    type="number"
                    value={editForm.shipping_fee}
                    onChange={(e) => setEditForm({ ...editForm, shipping_fee: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-[var(--color-ink-soft)] mb-1 block">
                      Fee Kurir Tetap (Rp)
                    </label>
                    <GlassInput
                      type="number"
                      value={editForm.courier_fee_flat}
                      onChange={(e) => setEditForm({ ...editForm, courier_fee_flat: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[var(--color-ink-soft)] mb-1 block">
                      Fee Kurir dari Ongkir (%)
                    </label>
                    <GlassInput
                      type="number"
                      step="0.1"
                      value={editForm.courier_fee_percent}
                      onChange={(e) => setEditForm({ ...editForm, courier_fee_percent: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <GradientButton type="submit" className="w-full mt-2" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
}
