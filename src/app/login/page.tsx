"use client";

import { useState } from "react";
import { GlassCard, GlassInput, GradientButton } from "@/components/ui";
import { MemberCard } from "@/components/MemberCard";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: panggil POST /api/auth/login dari canvasdist-api, simpan token
    setTimeout(() => setLoading(false), 800);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-6 items-center">
        {/* Kiri: preview kartu member — signature element, terlihat di layar besar */}
        <div className="hidden lg:flex flex-col gap-6 items-start">
          <div>
            <span
              className="w-11 h-11 rounded-2xl grid place-items-center text-white font-bold text-lg mb-5"
              style={{ background: "linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2))" }}
            >
              C
            </span>
            <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-extrabold leading-tight text-[var(--color-ink)]">
              Satu platform untuk<br />canvasing, distribusi,<br />& jaringan kamu.
            </h1>
            <p className="mt-3 text-sm text-[var(--color-ink-soft)] max-w-sm">
              Kelola kunjungan sales, order, pengiriman, saldo, dan komisi jaringan — semua
              real-time dari satu dashboard.
            </p>
          </div>
          <MemberCard name="Agen Semarang" level="agen" cardNumber="2026 0819 0003 A1F2" balance="Rp 4.250.000" />
        </div>

        {/* Kanan: form login */}
        <GlassCard strong className="w-full max-w-sm mx-auto p-7 sm:p-8">
          <div className="lg:hidden mb-6 flex items-center gap-2">
            <span
              className="w-9 h-9 rounded-xl grid place-items-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2))" }}
            >
              C
            </span>
            <span className="font-[family-name:var(--font-manrope)] font-bold text-base">CanvasDist</span>
          </div>

          <h2 className="font-[family-name:var(--font-manrope)] text-xl font-bold">Masuk ke akun kamu</h2>
          <p className="text-sm text-[var(--color-ink-soft)] mt-1 mb-6">
            Untuk Admin, Agen, Sales, Gudang, dan Kurir.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
                <GlassInput type="email" placeholder="nama@perusahaan.com" required className="pl-10" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Kata sandi</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
                <GlassInput type="password" placeholder="••••••••" required className="pl-10" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-1.5 text-[var(--color-ink-soft)]">
                <input type="checkbox" className="rounded accent-[var(--color-primary-1)]" />
                Ingat saya
              </label>
              <a href="#" className="text-[var(--color-primary-1)] font-medium">
                Lupa sandi?
              </a>
            </div>

            <GradientButton type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </GradientButton>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
