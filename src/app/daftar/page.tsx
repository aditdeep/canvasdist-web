"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { GlassCard, GlassInput, GradientButton } from "@/components/ui";
import { AlertCircle } from "lucide-react";
import { api, fetcher, ApiError, setToken } from "@/lib/api";
import type { Region, User } from "@/types";

export default function DaftarPage() {
  const { data: regions } = useSWR<Region[]>("/public/regions", fetcher);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    region_code: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post<{ user: User; token: string }>("/public/register", form);
      setToken(res.token);
      window.location.href = "/toko";
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal mendaftar, coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <GlassCard strong className="w-full max-w-md p-7 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <span
            className="w-9 h-9 rounded-xl grid place-items-center text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2))" }}
          >
            C
          </span>
          <span className="font-[family-name:var(--font-manrope)] font-bold text-base">CanvasDist</span>
        </div>

        <h1 className="font-[family-name:var(--font-manrope)] text-xl font-bold">Daftar Akun Customer</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-1 mb-6">
          Belanja produk dari agen terdekat di wilayah kamu.
        </p>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-[var(--color-danger)]/10 text-[var(--color-danger)] text-xs px-3 py-2.5 mb-4">
            <AlertCircle size={14} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Nama Lengkap</label>
            <GlassInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Email</label>
            <GlassInput type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">No. Telepon</label>
            <GlassInput required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Kata Sandi</label>
            <GlassInput
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Wilayah</label>
            <select
              required
              className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80"
              value={form.region_code}
              onChange={(e) => setForm({ ...form, region_code: e.target.value })}
            >
              <option value="">Pilih wilayah kamu...</option>
              {(regions ?? []).map((r) => (
                <option key={r.id} value={r.code}>
                  {r.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[var(--color-ink-faint)] mt-1">
              Menentukan agen mana yang akan melayani pesananmu.
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Alamat Lengkap</label>
            <textarea
              required
              className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80 min-h-20"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Nama jalan, nomor rumah, patokan..."
            />
          </div>

          <GradientButton type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Mendaftar..." : "Daftar & Mulai Belanja"}
          </GradientButton>
        </form>

        <p className="text-center text-xs text-[var(--color-ink-soft)] mt-5">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-[var(--color-primary-1)] font-semibold">
            Masuk
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
