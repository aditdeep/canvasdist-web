"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { Save, Upload } from "lucide-react";
import { GlassCard, GradientButton, GlassInput } from "@/components/ui";
import { ErrorState } from "@/components/DataTable";
import { api, fetcher, imageUrl, ApiError } from "@/lib/api";
import type { Settings, Paginated, User } from "@/types";

export default function PengaturanPage() {
  const { data, mutate } = useSWR<Settings>("/settings", fetcher);
  const { data: users } = useSWR<Paginated<User>>("/users?role=super_admin", fetcher);

  const [form, setForm] = useState({
    app_name: "",
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    platform_fee_percent: "0",
    platform_owner_user_id: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        app_name: data.app_name,
        owner_name: data.owner_name ?? "",
        owner_email: data.owner_email ?? "",
        owner_phone: data.owner_phone ?? "",
        platform_fee_percent: data.platform_fee_percent ?? "0",
        platform_owner_user_id: data.platform_owner_user_id ? String(data.platform_owner_user_id) : "",
      });
      setLogoPreview(data.logo_path);
    }
  }, [data]);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setLogo(file);
    setLogoPreview(file ? URL.createObjectURL(file) : data?.logo_path ?? null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append("app_name", form.app_name);
      formData.append("owner_name", form.owner_name);
      formData.append("owner_email", form.owner_email);
      formData.append("owner_phone", form.owner_phone);
      formData.append("platform_fee_percent", form.platform_fee_percent);
      if (form.platform_owner_user_id) formData.append("platform_owner_user_id", form.platform_owner_user_id);
      if (logo) formData.append("logo", logo);

      await api.postForm("/settings", formData);
      setSuccess(true);
      setLogo(null);
      mutate();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Pengaturan</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">
          Branding aplikasi, identitas pemilik, dan pembagian hasil platform.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <ErrorState message={error} />}
        {success && (
          <div className="rounded-xl bg-[var(--color-success)]/10 text-[var(--color-success)] text-sm px-4 py-3">
            Pengaturan berhasil disimpan.
          </div>
        )}

        <GlassCard className="space-y-4">
          <h2 className="font-semibold text-sm">Branding Aplikasi</h2>

          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/50 overflow-hidden shrink-0 grid place-items-center">
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo ? logoPreview : (imageUrl(logoPreview) ?? undefined)}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Upload size={20} className="text-[var(--color-ink-faint)]" />
                )}
              </div>
              <label className="glass-pill px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-white/80 transition">
                Pilih Logo
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Nama Aplikasi</label>
            <GlassInput required value={form.app_name} onChange={(e) => setForm({ ...form, app_name: e.target.value })} />
          </div>
        </GlassCard>

        <GlassCard className="space-y-4">
          <h2 className="font-semibold text-sm">Identitas Pemilik</h2>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Nama Pemilik/Perusahaan</label>
            <GlassInput value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Email Kontak</label>
              <GlassInput
                type="email"
                value={form.owner_email}
                onChange={(e) => setForm({ ...form, owner_email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Telepon</label>
              <GlassInput value={form.owner_phone} onChange={(e) => setForm({ ...form, owner_phone: e.target.value })} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="space-y-4">
          <h2 className="font-semibold text-sm">Bagi Hasil Platform</h2>
          <p className="text-xs text-[var(--color-ink-soft)]">
            Persentase ini otomatis terpotong dari setiap order yang selesai, terpisah dari komisi
            jaringan (wilayah/agen/reseller) — masuk ke saldo akun yang dipilih di bawah.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Persentase Fee (%)</label>
              <GlassInput
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={form.platform_fee_percent}
                onChange={(e) => setForm({ ...form, platform_fee_percent: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Penerima (akun kamu)</label>
              <select
                className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80"
                value={form.platform_owner_user_id}
                onChange={(e) => setForm({ ...form, platform_owner_user_id: e.target.value })}
              >
                <option value="">Belum dipilih</option>
                {users?.data.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </GlassCard>

        <GradientButton type="submit" disabled={saving}>
          <Save size={16} /> {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </GradientButton>
      </form>
    </div>
  );
}
