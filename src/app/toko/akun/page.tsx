"use client";

import { useEffect, useState } from "react";
import { LogOut, MapPin, Package, ShieldCheck, FileText, Save, ChevronRight } from "lucide-react";
import Link from "next/link";
import { GlassCard, GradientButton, GlassInput, GhostButton } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AkunPage() {
  const { user, logout, refreshUser, loading: authLoading } = useAuth();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setAddress(user.outlet?.address ?? user.address ?? "");
      setPhone(user.phone ?? "");
    }
  }, [user]);

  async function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await api.post("/auth/address", { address, phone });
      await refreshUser();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menyimpan alamat");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) {
    return <div className="h-64 rounded-2xl bg-white/40 animate-pulse max-w-2xl mx-auto" />;
  }

  if (!user) {
    return (
      <GlassCard className="max-w-md mx-auto text-center py-12">
        <p className="text-sm text-[var(--color-ink-soft)] mb-4">Kamu perlu masuk untuk melihat halaman ini.</p>
        <Link href="/login?redirect=/toko/akun">
          <GradientButton>Masuk</GradientButton>
        </Link>
      </GlassCard>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Akun Saya</h1>

      <GlassCard className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full grid place-items-center text-white font-bold text-lg shrink-0"
          style={{ background: "linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2))" }}
        >
          {user.name.split(" ").slice(0, 2).map((s) => s[0]).join("").toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-[var(--color-ink)]">{user.name}</p>
          <p className="text-xs text-[var(--color-ink-soft)]">{user.email}</p>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={16} className="text-[var(--color-primary-1)]" />
          <h2 className="font-semibold text-sm">Alamat Pengiriman</h2>
        </div>

        {error && (
          <div className="rounded-xl bg-[var(--color-danger)]/10 text-[var(--color-danger)] text-xs px-3 py-2.5 mb-3">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl bg-[var(--color-success)]/10 text-[var(--color-success)] text-xs px-3 py-2.5 mb-3">
            Alamat berhasil disimpan.
          </div>
        )}

        <form onSubmit={handleSaveAddress} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">No. Telepon</label>
            <GlassInput value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Alamat Lengkap</label>
            <textarea
              className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80 min-h-20"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nama jalan, nomor rumah, patokan..."
            />
          </div>
          <GhostButton type="submit" disabled={saving}>
            <Save size={14} /> {saving ? "Menyimpan..." : "Simpan Alamat"}
          </GhostButton>
        </form>
      </GlassCard>

      <GlassCard>
        <Link href="/toko/pesanan" className="flex items-center gap-2 py-2 border-b border-white/60 text-sm text-[var(--color-ink)]">
          <Package size={16} className="text-[var(--color-ink-soft)]" />
          <span className="flex-1">Pesanan Saya</span>
          <ChevronRight size={16} className="text-[var(--color-ink-faint)]" />
        </Link>
        <Link href="/privacy-policy" className="flex items-center gap-2 py-2 border-b border-white/60 text-sm text-[var(--color-ink)]">
          <ShieldCheck size={16} className="text-[var(--color-ink-soft)]" />
          <span className="flex-1">Kebijakan Privasi</span>
          <ChevronRight size={16} className="text-[var(--color-ink-faint)]" />
        </Link>
        <Link href="/terms" className="flex items-center gap-2 py-2 text-sm text-[var(--color-ink)]">
          <FileText size={16} className="text-[var(--color-ink-soft)]" />
          <span className="flex-1">Syarat &amp; Ketentuan</span>
          <ChevronRight size={16} className="text-[var(--color-ink-faint)]" />
        </Link>
      </GlassCard>

      <GhostButton onClick={() => logout()} className="w-full">
        <LogOut size={16} className="text-[var(--color-danger)]" />
        <span className="text-[var(--color-danger)] font-semibold">Keluar</span>
      </GhostButton>
    </div>
  );
}
