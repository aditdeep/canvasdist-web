"use client";

import { useState } from "react";
import useSWR from "swr";
import { Truck, ChevronRight, Navigation, Camera, Check } from "lucide-react";
import { GlassCard, Badge, GhostButton, GradientButton } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { PhotoCapture } from "@/components/PhotoCapture";
import { api, fetcher, formatDateTime, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Paginated, DeliveryOrder } from "@/types";

const STATUS_LABEL: Record<DeliveryOrder["status"], string> = {
  siap_kirim: "Siap Kirim",
  dikirim: "Dikirim",
  sampai_tujuan: "Sampai Tujuan",
  selesai: "Selesai",
};

const STATUS_TONE: Record<DeliveryOrder["status"], "primary" | "success" | "warning" | "neutral"> = {
  siap_kirim: "neutral",
  dikirim: "primary",
  sampai_tujuan: "warning",
  selesai: "success",
};

const NEXT_STATUS: Partial<Record<DeliveryOrder["status"], DeliveryOrder["status"]>> = {
  siap_kirim: "dikirim",
  dikirim: "sampai_tujuan",
};

export default function PengirimanPage() {
  const { user } = useAuth();
  const { data, error, isLoading, mutate } = useSWR<Paginated<DeliveryOrder>>("/delivery-orders", fetcher);

  if (user?.role === "kurir") {
    return <KurirView data={data} error={error} isLoading={isLoading} mutate={mutate} />;
  }

  async function advanceStatus(id: number, next: DeliveryOrder["status"]) {
    try {
      await api.put(`/delivery-orders/${id}`, { status: next });
      mutate();
    } catch {
      // ditangani via retry manual oleh user untuk saat ini
    }
  }

  const rows = data?.data ?? [];

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Pengiriman & Tracking</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Surat Jalan dan status kirim tiap order.</p>
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data pengiriman." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={Truck} title="Belum ada Surat Jalan" description="Surat Jalan dibuat otomatis saat order di-approve dari gudang." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<DeliveryOrder>
            rows={rows}
            columns={[
              { header: "No. DO", render: (d) => <span className="font-[family-name:var(--font-jbmono)] text-xs">{d.do_number}</span> },
              { header: "Outlet", render: (d) => d.order?.outlet?.name ?? "-" },
              { header: "Kurir", render: (d) => d.courier?.name ?? "Belum ditugaskan" },
              { header: "Dikirim", render: (d) => formatDateTime(d.shipped_at) },
              { header: "Status", render: (d) => <Badge tone={STATUS_TONE[d.status]}>{STATUS_LABEL[d.status]}</Badge> },
              {
                header: "",
                render: (d) =>
                  NEXT_STATUS[d.status] ? (
                    <GhostButton
                      onClick={(e) => {
                        e.stopPropagation();
                        advanceStatus(d.id, NEXT_STATUS[d.status]!);
                      }}
                      className="!px-3 !py-1.5 text-xs"
                    >
                      {STATUS_LABEL[NEXT_STATUS[d.status]!]} <ChevronRight size={13} />
                    </GhostButton>
                  ) : null,
              },
            ]}
          />
        )}
      </GlassCard>
    </div>
  );
}

/**
 * Tampilan khusus Kurir: card per pengiriman (bukan tabel — lebih enak dipakai
 * di HP), dengan tombol kirim GPS selama otw dan upload foto POD saat sampai.
 */
function KurirView({
  data,
  error,
  isLoading,
  mutate,
}: {
  data?: Paginated<DeliveryOrder>;
  error: unknown;
  isLoading: boolean;
  mutate: () => void;
}) {
  const [trackingId, setTrackingId] = useState<number | null>(null);
  const [podTarget, setPodTarget] = useState<DeliveryOrder | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [podError, setPodError] = useState<string | null>(null);

  const rows = (data?.data ?? []).filter((d) => d.status !== "selesai");

  async function startDelivery(id: number) {
    await api.put(`/delivery-orders/${id}`, { status: "dikirim" });
    mutate();
  }

  async function sendLocation(id: number) {
    if (!navigator.geolocation) return;
    setTrackingId(id);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.post(`/delivery-orders/${id}/track`, {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            status: "dikirim",
          });
        } finally {
          setTrackingId(null);
        }
      },
      () => setTrackingId(null)
    );
  }

  async function markArrived(id: number) {
    await api.put(`/delivery-orders/${id}`, { status: "sampai_tujuan" });
    mutate();
  }

  async function submitPod(e: React.FormEvent) {
    e.preventDefault();
    if (!podTarget || !photo) {
      setPodError("Foto bukti terima wajib diambil.");
      return;
    }
    setSaving(true);
    setPodError(null);

    const finish = async (lat?: number, lng?: number) => {
      try {
        const formData = new FormData();
        formData.append("photo", photo);
        if (lat && lng) {
          formData.append("lat", String(lat));
          formData.append("lng", String(lng));
        }
        await api.postForm(`/delivery-orders/${podTarget.id}/pod`, formData);
        setPodTarget(null);
        setPhoto(null);
        mutate();
      } catch (err) {
        setPodError(err instanceof ApiError ? err.message : "Gagal upload bukti terima.");
      } finally {
        setSaving(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => finish(pos.coords.latitude, pos.coords.longitude),
        () => finish()
      );
    } else {
      finish();
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Pengiriman Kamu</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">Kelola pengiriman yang ditugaskan ke kamu hari ini.</p>
      </div>

      {isLoading && <LoadingRows />}
      {!!error && <ErrorState message="Gagal memuat data pengiriman." />}
      {!isLoading && !error && rows.length === 0 && (
        <EmptyState icon={Truck} title="Tidak ada pengiriman aktif" description="Pengiriman yang ditugaskan ke kamu akan muncul di sini." />
      )}

      <div className="space-y-3">
        {rows.map((d) => (
          <GlassCard key={d.id}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-[family-name:var(--font-jbmono)] text-xs text-[var(--color-ink-soft)]">{d.do_number}</p>
                <p className="font-semibold text-sm mt-0.5">{d.order?.outlet?.name ?? "Outlet"}</p>
                <p className="text-xs text-[var(--color-ink-soft)]">{d.order?.outlet?.address ?? "-"}</p>
              </div>
              <Badge tone={STATUS_TONE[d.status]}>{STATUS_LABEL[d.status]}</Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {d.status === "siap_kirim" && (
                <GradientButton onClick={() => startDelivery(d.id)} className="!py-2 text-xs flex-1">
                  <Truck size={14} /> Mulai Kirim
                </GradientButton>
              )}

              {d.status === "dikirim" && (
                <>
                  <GhostButton
                    onClick={() => sendLocation(d.id)}
                    disabled={trackingId === d.id}
                    className="!py-2 text-xs flex-1"
                  >
                    <Navigation size={14} /> {trackingId === d.id ? "Mengirim..." : "Kirim Lokasi"}
                  </GhostButton>
                  <GradientButton onClick={() => markArrived(d.id)} className="!py-2 text-xs flex-1">
                    <Check size={14} /> Sudah Sampai
                  </GradientButton>
                </>
              )}

              {d.status === "sampai_tujuan" && (
                <GradientButton onClick={() => setPodTarget(d)} className="!py-2 text-xs flex-1">
                  <Camera size={14} /> Upload Bukti Terima
                </GradientButton>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal open={!!podTarget} onClose={() => setPodTarget(null)} title="Upload Bukti Terima (POD)">
        <form onSubmit={submitPod} className="space-y-3">
          {podError && <ErrorState message={podError} />}
          <PhotoCapture onChange={setPhoto} label="Foto barang diterima outlet" />
          <p className="text-[11px] text-[var(--color-ink-faint)]">
            Lokasi GPS kamu saat ini akan disertakan otomatis sebagai bukti tambahan.
          </p>
          <GradientButton type="submit" className="w-full" disabled={saving || !photo}>
            {saving ? "Mengunggah..." : "Selesaikan Pengiriman"}
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
}
