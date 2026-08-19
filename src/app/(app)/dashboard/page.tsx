import { StatCard } from "@/components/StatCard";
import { GlassCard, Badge } from "@/components/ui";
import { MemberCard } from "@/components/MemberCard";
import { Wallet2, ClipboardList, Network, TrendingUp, MapPin, Truck, PackageCheck } from "lucide-react";

const activities = [
  { icon: MapPin, title: "Sales Budi checkin di Toko Sumber Rejeki", time: "5 menit lalu", tone: "primary" as const },
  { icon: ClipboardList, title: "Order ORD-20260819-A1B2C3 menunggu approval", time: "22 menit lalu", tone: "warning" as const },
  { icon: Truck, title: "DO-20260819-X9Y8Z7 dalam perjalanan ke outlet", time: "1 jam lalu", tone: "primary" as const },
  { icon: PackageCheck, title: "Order ORD-20260818-Q1W2E3 selesai, komisi tercatat", time: "3 jam lalu", tone: "success" as const },
];

export default function DashboardPage() {
  return (
    <div className="space-y-5 max-w-7xl">
      <div>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[var(--color-ink)]">
          Selamat datang, Agen Semarang 👋
        </h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Ini ringkasan aktivitas jaringan kamu hari ini.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Omzet Bulan Ini" value="Rp 128,4jt" delta="+12,4%" icon={<TrendingUp size={16} />} />
        <StatCard label="Order Aktif" value="34" delta="+6" icon={<ClipboardList size={16} />} />
        <StatCard label="Komisi Pending" value="Rp 3,2jt" icon={<Network size={16} />} />
        <StatCard label="Saldo Wallet" value="Rp 4,25jt" icon={<Wallet2 size={16} />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Aktivitas terbaru */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-manrope)] font-bold text-[15px]">Aktivitas Terbaru</h2>
            <a href="/laporan" className="text-xs font-medium text-[var(--color-primary-1)]">
              Lihat semua
            </a>
          </div>
          <div className="space-y-1">
            {activities.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/50 transition"
              >
                <span className="w-9 h-9 rounded-lg glass-pill grid place-items-center text-[var(--color-primary-1)] shrink-0">
                  <a.icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--color-ink)] truncate">{a.title}</p>
                  <p className="text-[11px] text-[var(--color-ink-soft)]">{a.time}</p>
                </div>
                <Badge tone={a.tone}>{a.tone === "success" ? "Selesai" : a.tone === "warning" ? "Perlu Aksi" : "Info"}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Kartu member */}
        <div className="flex flex-col gap-4">
          <GlassCard className="flex flex-col items-center gap-4">
            <p className="self-start font-[family-name:var(--font-manrope)] font-bold text-[15px]">Kartu Member Kamu</p>
            <MemberCard name="Agen Semarang" level="agen" cardNumber="2026 0819 0003 A1F2" balance="Rp 4.250.000" compact />
            <a href="/saldo" className="self-stretch text-center text-xs font-semibold text-[var(--color-primary-1)] glass-pill py-2.5">
              Kelola Saldo →
            </a>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
