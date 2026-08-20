"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import useSWR from "swr";
import { useBranding } from "@/lib/use-branding";
import { imageUrl, fetcher } from "@/lib/api";
import type { Settings } from "@/types";

export function StoreFooter() {
  const branding = useBranding();
  const { data: publicSettings } = useSWR<Partial<Settings>>("/public/settings", fetcher);

  return (
    <footer className="mt-16 px-4 pb-8 lg:px-6">
      <div className="glass max-w-6xl mx-auto px-6 py-8">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              {branding.logo_path ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl(branding.logo_path) ?? undefined} alt={branding.app_name} className="w-8 h-8 rounded-lg object-contain" />
              ) : (
                <span
                  className="w-8 h-8 rounded-lg grid place-items-center text-white font-bold text-sm"
                  style={{ background: "linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2))" }}
                >
                  {branding.app_name.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="font-[family-name:var(--font-manrope)] font-bold text-base">{branding.app_name}</span>
            </div>
            <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed">
              Belanja produk langsung dari agen terdekat di wilayahmu — diantar atau ambil sendiri.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-[var(--color-ink)] mb-3">Tautan</p>
            <div className="flex flex-col gap-2">
              <Link href="/toko" className="text-xs text-[var(--color-ink-soft)] hover:text-[var(--color-primary-1)]">
                Belanja
              </Link>
              <Link href="/privacy-policy" className="text-xs text-[var(--color-ink-soft)] hover:text-[var(--color-primary-1)]">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="text-xs text-[var(--color-ink-soft)] hover:text-[var(--color-primary-1)]">
                Syarat &amp; Ketentuan
              </Link>
              <Link href="/login" className="text-xs text-[var(--color-ink-soft)] hover:text-[var(--color-primary-1)]">
                Masuk Dashboard Internal
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-[var(--color-ink)] mb-3">Kontak</p>
            <div className="flex flex-col gap-2">
              {publicSettings?.owner_email && (
                <a
                  href={`mailto:${publicSettings.owner_email}`}
                  className="flex items-center gap-1.5 text-xs text-[var(--color-ink-soft)] hover:text-[var(--color-primary-1)]"
                >
                  <Mail size={13} /> {publicSettings.owner_email}
                </a>
              )}
              {publicSettings?.owner_phone && (
                <a
                  href={`tel:${publicSettings.owner_phone}`}
                  className="flex items-center gap-1.5 text-xs text-[var(--color-ink-soft)] hover:text-[var(--color-primary-1)]"
                >
                  <Phone size={13} /> {publicSettings.owner_phone}
                </a>
              )}
              {!publicSettings?.owner_email && !publicSettings?.owner_phone && (
                <p className="text-xs text-[var(--color-ink-faint)]">Info kontak belum diisi.</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/60 mt-8 pt-5 text-center">
          <p className="text-[11px] text-[var(--color-ink-faint)]">
            © {new Date().getFullYear()} {publicSettings?.owner_name || branding.app_name}. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
