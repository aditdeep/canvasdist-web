import { GlassCard, GradientButton, Badge } from "@/components/ui";
import { MemberCard } from "@/components/MemberCard";
import { ArrowDownLeft, ArrowUpRight, Gift, Recycle } from "lucide-react";

const mutations = [
  { icon: ArrowDownLeft, title: "Top up saldo via Duitku", ref: "TOPUP-20260819103000", amount: "+Rp 500.000", tone: "success" as const },
  { icon: Gift, title: "Komisi jaringan cair — order #ORD-20260817-K1", ref: "COMMISSION-118", amount: "+Rp 145.000", tone: "success" as const },
  { icon: Recycle, title: "Cashback jerigen bekas x12", ref: "BUYBACK-54", amount: "+Rp 36.000", tone: "success" as const },
  { icon: ArrowUpRight, title: "Pembayaran order ORD-20260819-A1B2C3", ref: "ORDER-902", amount: "-Rp 320.000", tone: "danger" as const },
];

export default function SaldoPage() {
  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Saldo</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">
          Top up, bayar order lebih cepat, dan lihat riwayat mutasi saldo kamu.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <MemberCard name="Agen Semarang" level="agen" cardNumber="2026 0819 0003 A1F2" balance="Rp 4.250.000" />
          <GlassCard>
            <p className="text-xs text-[var(--color-ink-soft)] mb-3">Top up cepat</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {["100rb", "500rb", "1jt"].map((v) => (
                <button
                  key={v}
                  className="glass-pill py-2 text-xs font-semibold text-[var(--color-ink)] hover:bg-white/80 transition"
                >
                  {v}
                </button>
              ))}
            </div>
            <GradientButton className="w-full">Top Up via Duitku</GradientButton>
            <p className="text-[11px] text-[var(--color-ink-faint)] mt-2 text-center">
              Bayar pakai saldo, dapat diskon tambahan untuk order tertentu.
            </p>
          </GlassCard>
        </div>

        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-manrope)] font-bold text-[15px]">Riwayat Mutasi</h2>
            <Badge tone="neutral">30 hari terakhir</Badge>
          </div>
          <div className="space-y-1">
            {mutations.map((m, i) => (
              <div key={i} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/50 transition">
                <span
                  className={`w-9 h-9 rounded-lg glass-pill grid place-items-center shrink-0 ${
                    m.tone === "success" ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
                  }`}
                >
                  <m.icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--color-ink)] truncate">{m.title}</p>
                  <p className="text-[11px] text-[var(--color-ink-soft)] font-[family-name:var(--font-jbmono)]">{m.ref}</p>
                </div>
                <span
                  className={`text-sm font-semibold font-[family-name:var(--font-jbmono)] ${
                    m.tone === "success" ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
                  }`}
                >
                  {m.amount}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
