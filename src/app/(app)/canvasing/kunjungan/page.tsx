"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, MapPinned, Navigation } from "lucide-react";
import { GlassCard, GradientButton } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { PhotoCapture } from "@/components/PhotoCapture";
import { api, fetcher, formatDateTime, ApiError } from "@/lib/api";
import type { Paginated, Visit, Outlet } from "@/types";

export default function KunjunganPage() {
  const { data, error, isLoading, mutate } = useSWR<Paginated<Visit>>("/visits", fetcher);
  const { data: outlets } = useSWR<Paginated<Outlet>>("/outlets", fetcher);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [outletId, setOutletId] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [locating, setLocating] = useState(false);

  async function handleCheckin(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!navigator.geolocation) {
      setFormError("Browser tidak mendukung GPS. Gunakan app mobile untuk checkin akurat.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocating(false);
        setSaving(true);
        try {
          const formData = new FormData();
          formData.append("outlet_id", outletId);
          formData.append("checkin_lat", String(pos.coords.latitude));
          formData.append("checkin_lng", String(pos.coords.longitude));
          formData.append("notes", notes);
          if (photo) formData.append("photo", photo);

          await api.postForm("/visits/checkin", formData);
          setOpen(false);
          setOutletId("");
          setNotes("");
          setPhoto(null);
          mutate();
        } catch (err) {
          setFormError(err instanceof ApiError ? err.message : "Gagal checkin");
        } finally {
          setSaving(false);
        }
      },
      () => {
        setLocating(false);
        setFormError("Gagal mengambil lokasi GPS. Izinkan akses lokasi di browser.");
      }
    );
  }

  const rows = data?.data ?? [];

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Kunjungan Sales</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Riwayat checkin canvasing ke outlet.</p>
        </div>
        <GradientButton onClick={() => setOpen(true)} className="shrink-0">
          <Navigation size={16} /> Checkin
        </GradientButton>
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data kunjungan." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={MapPinned} title="Belum ada kunjungan" description="Checkin pertama kamu akan muncul di sini." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<Visit>
            rows={rows}
            columns={[
              { header: "Outlet", render: (v) => <span className="font-medium">{v.outlet?.name ?? `#${v.outlet_id}`}</span> },
              { header: "Waktu", render: (v) => formatDateTime(v.visited_at) },
              { header: "Catatan", render: (v) => <span className="text-xs">{v.notes || "-"}</span> },
              {
                header: "Lokasi",
                render: (v) =>
                  v.checkin_lat ? (
                    <span className="font-[family-name:var(--font-jbmono)] text-[11px] text-[var(--color-ink-soft)]">
                      {Number(v.checkin_lat).toFixed(4)}, {Number(v.checkin_lng).toFixed(4)}
                    </span>
                  ) : (
                    "-"
                  ),
              },
            ]}
          />
        )}
      </GlassCard>

      <Modal open={open} onClose={() => setOpen(false)} title="Checkin Kunjungan">
        <form onSubmit={handleCheckin} className="space-y-3">
          {formError && <ErrorState message={formError} />}
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Outlet</label>
            <select
              required
              className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80"
              value={outletId}
              onChange={(e) => setOutletId(e.target.value)}
            >
              <option value="">Pilih outlet...</option>
              {outlets?.data.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Catatan</label>
            <textarea
              className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80 min-h-20"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Kondisi stok outlet, permintaan khusus, dll."
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Foto Etalase/Stok (opsional)</label>
            <PhotoCapture onChange={setPhoto} label="Ambil foto outlet" />
          </div>
          <p className="text-[11px] text-[var(--color-ink-faint)] flex items-center gap-1.5">
            <Navigation size={12} /> Lokasi GPS diambil otomatis saat checkin.
          </p>
          <GradientButton type="submit" className="w-full mt-2" disabled={saving || locating}>
            {locating ? "Mengambil lokasi..." : saving ? "Menyimpan..." : "Checkin Sekarang"}
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
}
