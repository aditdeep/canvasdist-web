"use client";

import { useState } from "react";
import useSWR from "swr";
import { Truck, ChevronRight, Navigation, Camera, Check, Route as RouteIcon, Plus, X } from "lucide-react";
import { GlassCard, Badge, GhostButton, GradientButton } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { PhotoCapture } from "@/components/PhotoCapture";
import { api, fetcher, formatDateTime, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Paginated, DeliveryOrder, Hub, User } from "@/types";

const STATUS_LABEL: Record<DeliveryOrder["status"], string> = {
  siap_kirim: "Siap Kirim",
  dikirim: "Dikirim",
  di_hub: "Di Hub (Transit)",
  sampai_tujuan: "Sampai Tujuan",
  selesai: "Selesai",
};

const STATUS_TONE: Record<DeliveryOrder["status"], "primary" | "success" | "warning" | "neutral"> = {
  siap_kirim: "neutral",
  dikirim: "primary",
  di_hub: "warning",
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
  const [routeTarget, setRouteTarget] = useState<DeliveryOrder | null>(null);

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
                render: (d) => (
                  <div className="flex items-center gap-2">
                    <GhostButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setRouteTarget(d);
                      }}
                      className="!px-3 !py-1.5 text-xs"
                    >
                      <RouteIcon size={13} /> Rute
                    </GhostButton>
                    {NEXT_STATUS[d.status] && (
                      <GhostButton
                        onClick={(e) => {
                          e.stopPropagation();
                          advanceStatus(d.id, NEXT_STATUS[d.status]!);
                        }}
                        className="!px-3 !py-1.5 text-xs"
                      >
                        {STATUS_LABEL[NEXT_STATUS[d.status]!]} <ChevronRight size={13} />
                      </GhostButton>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}
      </GlassCard>

      {routeTarget && (
        <RouteModal
          deliveryOrder={routeTarget}
          onClose={() => setRouteTarget(null)}
          onSaved={() => {
            setRouteTarget(null);
            mutate();
          }}
        />
      )}
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

  const currentUserId = useAuth().user?.id;

  function activeLegFor(d: DeliveryOrder) {
    if (!d.legs || d.legs.length === 0) return null;
    return d.legs.find((l) => l.status !== "arrived") ?? null;
  }

  async function startLeg(legId: number) {
    await api.post(`/delivery-legs/${legId}/start`);
    mutate();
  }

  async function arriveLeg(legId: number) {
    await api.post(`/delivery-legs/${legId}/arrive`);
    mutate();
  }

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
        {rows.map((d) => {
          const leg = activeLegFor(d);
          const hasRoute = !!(d.legs && d.legs.length > 0);
          const myLeg = leg && leg.courier_id === currentUserId ? leg : null;

          return (
            <GlassCard key={d.id}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-[family-name:var(--font-jbmono)] text-xs text-[var(--color-ink-soft)]">{d.do_number}</p>
                  <p className="font-semibold text-sm mt-0.5">{d.order?.outlet?.name ?? "Outlet"}</p>
                  <p className="text-xs text-[var(--color-ink-soft)]">{d.order?.outlet?.address ?? "-"}</p>
                  {hasRoute && leg && (
                    <p className="text-[11px] text-[var(--color-primary-1)] mt-1">
                      Etape {leg.sequence}: {leg.from_hub?.name ?? "Gudang asal"} → {leg.to_hub?.name ?? "Outlet (last-mile)"}
                    </p>
                  )}
                </div>
                <Badge tone={STATUS_TONE[d.status]}>{STATUS_LABEL[d.status]}</Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {/* --- Alur dengan rute multi-hub, dan etape aktif adalah milik kurir ini --- */}
                {hasRoute && myLeg && myLeg.status === "pending" && (
                  <GradientButton onClick={() => startLeg(myLeg.id)} className="!py-2 text-xs flex-1">
                    <Truck size={14} /> Mulai Etape {myLeg.sequence}
                  </GradientButton>
                )}
                {hasRoute && myLeg && myLeg.status === "in_transit" && !myLeg.to_hub_id && (
                  <GradientButton onClick={() => setPodTarget(d)} className="!py-2 text-xs flex-1">
                    <Camera size={14} /> Upload Bukti Terima (Last-Mile)
                  </GradientButton>
                )}
                {hasRoute && myLeg && myLeg.status === "in_transit" && myLeg.to_hub_id && (
                  <GradientButton onClick={() => arriveLeg(myLeg.id)} className="!py-2 text-xs flex-1">
                    <Check size={14} /> Sampai di {myLeg.to_hub?.name ?? "Hub"}
                  </GradientButton>
                )}
                {hasRoute && leg && leg.courier_id !== currentUserId && (
                  <p className="text-xs text-[var(--color-ink-faint)] py-2">
                    Menunggu kurir etape ini ({leg.courier?.name ?? "belum ditugaskan"}).
                  </p>
                )}

                {/* --- Alur simple tanpa rute (single-leg langsung) --- */}
                {!hasRoute && d.status === "siap_kirim" && (
                  <GradientButton onClick={() => startDelivery(d.id)} className="!py-2 text-xs flex-1">
                    <Truck size={14} /> Mulai Kirim
                  </GradientButton>
                )}
                {!hasRoute && d.status === "dikirim" && (
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
                {!hasRoute && d.status === "sampai_tujuan" && (
                  <GradientButton onClick={() => setPodTarget(d)} className="!py-2 text-xs flex-1">
                    <Camera size={14} /> Upload Bukti Terima
                  </GradientButton>
                )}
              </div>
            </GlassCard>
          );
        })}
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

/**
 * Modal untuk admin/agen/gudang mendefinisikan rute multi-hub sebuah Surat Jalan:
 * urutan hub yang dilewati + kurir tiap etape, sebelum sampai outlet.
 */
type LegDraft = { from_hub_id: string; to_hub_id: string; courier_id: string };

function RouteModal({
  deliveryOrder,
  onClose,
  onSaved,
}: {
  deliveryOrder: DeliveryOrder;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { data: hubs } = useSWR<Paginated<Hub>>("/hubs", fetcher);
  const { data: users } = useSWR<Paginated<User>>("/users", fetcher);

  const couriers = (users?.data ?? []).filter((u) => u.role === "kurir");

  const [legs, setLegs] = useState<LegDraft[]>(
    deliveryOrder.legs && deliveryOrder.legs.length > 0
      ? deliveryOrder.legs.map((l) => ({
          from_hub_id: l.from_hub_id ? String(l.from_hub_id) : "",
          to_hub_id: l.to_hub_id ? String(l.to_hub_id) : "",
          courier_id: l.courier_id ? String(l.courier_id) : "",
        }))
      : [{ from_hub_id: "", to_hub_id: "", courier_id: "" }]
  );
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function updateLeg(i: number, patch: Partial<LegDraft>) {
    setLegs((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  function addLeg() {
    setLegs((prev) => [...prev, { from_hub_id: "", to_hub_id: "", courier_id: "" }]);
  }

  function removeLeg(i: number) {
    setLegs((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await api.post(`/delivery-orders/${deliveryOrder.id}/legs`, {
        legs: legs.map((l) => ({
          from_hub_id: l.from_hub_id ? Number(l.from_hub_id) : null,
          to_hub_id: l.to_hub_id ? Number(l.to_hub_id) : null,
          courier_id: l.courier_id ? Number(l.courier_id) : null,
        })),
      });
      onSaved();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal menyimpan rute");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={`Rute Pengiriman — ${deliveryOrder.do_number}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {formError && <ErrorState message={formError} />}
        <p className="text-xs text-[var(--color-ink-soft)]">
          Susun etape hub yang dilewati sebelum sampai outlet. Kosongkan &quot;Hub Tujuan&quot; pada
          etape terakhir untuk menandai last-mile langsung ke outlet.
        </p>

        <div className="space-y-3">
          {legs.map((leg, i) => (
            <div key={i} className="rounded-xl border border-white/60 p-3 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--color-primary-1)]">Etape {i + 1}</span>
                {legs.length > 1 && (
                  <button type="button" onClick={() => removeLeg(i)} className="text-[var(--color-danger)]">
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[var(--color-ink-soft)] block mb-1">Dari Hub</label>
                  <select
                    className="w-full rounded-lg bg-white/50 border border-white/70 px-2 py-2 text-xs outline-none"
                    value={leg.from_hub_id}
                    onChange={(e) => updateLeg(i, { from_hub_id: e.target.value })}
                  >
                    <option value="">Gudang asal</option>
                    {hubs?.data.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[var(--color-ink-soft)] block mb-1">Hub Tujuan</label>
                  <select
                    className="w-full rounded-lg bg-white/50 border border-white/70 px-2 py-2 text-xs outline-none"
                    value={leg.to_hub_id}
                    onChange={(e) => updateLeg(i, { to_hub_id: e.target.value })}
                  >
                    <option value="">Langsung ke outlet</option>
                    {hubs?.data.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-[var(--color-ink-soft)] block mb-1">Kurir Etape Ini</label>
                <select
                  className="w-full rounded-lg bg-white/50 border border-white/70 px-2 py-2 text-xs outline-none"
                  value={leg.courier_id}
                  onChange={(e) => updateLeg(i, { courier_id: e.target.value })}
                >
                  <option value="">Pilih kurir...</option>
                  {couriers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <GhostButton type="button" onClick={addLeg} className="w-full !py-2 text-xs">
          <Plus size={14} /> Tambah Etape
        </GhostButton>

        <GradientButton type="submit" className="w-full mt-2" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Rute"}
        </GradientButton>
      </form>
    </Modal>
  );
}
