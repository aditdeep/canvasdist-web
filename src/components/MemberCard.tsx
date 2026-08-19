"use client";

import { useRef, useState } from "react";

type MemberCardProps = {
  name: string;
  level: string;
  cardNumber: string;
  balance?: string;
  compact?: boolean;
};

const LEVEL_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  wilayah: "Wilayah",
  agen: "Agen",
  reseller: "Reseller",
  sales: "Sales",
  kurir: "Kurir",
};

/**
 * Kartu member digital ala ATM (Livin by Mandiri style): permukaan kaca dengan
 * sapuan cahaya holografik yang mengikuti kursor, nomor kartu monospace timbul,
 * dan chip + QR corner. Dipakai di halaman Saldo & preview kecil di Login.
 */
export function MemberCard({ name, level, cardNumber, balance, compact }: MemberCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glowX: 50, glowY: 50 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (py - 0.5) * -6,
      y: (px - 0.5) * 8,
      glowX: px * 100,
      glowY: py * 100,
    });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0, glowX: 50, glowY: 50 });
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full ${compact ? "max-w-[280px]" : "max-w-[380px]"} aspect-[1.586/1] rounded-[22px] overflow-hidden select-none transition-transform duration-300 ease-out`}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Base gradient — indigo to violet, gold hairline accents */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #4b4fe0 0%, #6d5ff0 38%, #9b6bf2 72%, #caa1f0 100%)",
        }}
      />
      {/* Holographic sheen following cursor */}
      <div
        className="absolute inset-0 opacity-70 mix-blend-overlay transition-[background] duration-150"
        style={{
          background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(255,255,255,0.55), transparent 55%)`,
        }}
      />
      {/* Fine noise/border glass edge */}
      <div className="absolute inset-0 rounded-[22px] border border-white/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/70 font-medium">CanvasDist</p>
            <p className="text-[11px] text-white/85 mt-0.5">{LEVEL_LABEL[level] ?? level}</p>
          </div>
          {/* Chip */}
          <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-200 to-amber-400 shadow-inner shadow-amber-900/30" />
        </div>

        <div>
          <p className="font-[family-name:var(--font-jbmono)] text-lg sm:text-xl tracking-[0.15em] drop-shadow-sm">
            {cardNumber}
          </p>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="text-[10px] text-white/70 uppercase tracking-wide">Pemegang Kartu</p>
              <p className="text-sm font-semibold">{name}</p>
            </div>
            {balance && (
              <div className="text-right">
                <p className="text-[10px] text-white/70 uppercase tracking-wide">Saldo</p>
                <p className="text-sm font-semibold font-[family-name:var(--font-jbmono)]">{balance}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR corner mark */}
      <div className="absolute bottom-4 right-4 w-8 h-8 rounded-md bg-white/20 border border-white/40 grid grid-cols-3 grid-rows-3 gap-[1px] p-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className={`rounded-[1px] ${[0, 2, 4, 6, 8].includes(i) ? "bg-white/90" : "bg-transparent"}`} />
        ))}
      </div>
    </div>
  );
}
