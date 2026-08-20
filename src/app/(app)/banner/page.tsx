"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, ImageIcon, X } from "lucide-react";
import { GlassCard, GradientButton, GlassInput, Badge } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { api, fetcher, imageUrl, ApiError } from "@/lib/api";
import type { Paginated, Banner } from "@/types";

const EMPTY_FORM = { title: "", subtitle: "", link_url: "" };

export default function BannerPage() {
  const { data, error, isLoading, mutate } = useSWR<Paginated<Banner>>("/banners", fetcher);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImage(null);
    setImagePreview(null);
    setFormError(null);
    setOpen(true);
  }

  function openEdit(banner: Banner) {
    setEditing(banner);
    setForm({ title: banner.title, subtitle: banner.subtitle ?? "", link_url: banner.link_url ?? "" });
    setImage(null);
    setImagePreview(banner.image_path);
    setFormError(null);
    setOpen(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : editing?.image_path ?? null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("subtitle", form.subtitle);
      formData.append("link_url", form.link_url);
      if (image) formData.append("image", image);

      if (editing) {
        formData.append("_method", "PUT");
        await api.postForm(`/banners/${editing.id}`, formData);
      } else {
        await api.postForm("/banners", formData);
      }

      setOpen(false);
      mutate();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal menyimpan banner");
    } finally {
      setSaving(false);
    }
  }

  const rows = data?.data ?? [];

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Banner Hero</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">
            Gambar slide di halaman utama storefront (web &amp; mobile).
          </p>
        </div>
        <GradientButton onClick={openCreate} className="shrink-0">
          <Plus size={16} /> Tambah
        </GradientButton>
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data banner." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={ImageIcon} title="Belum ada banner" description="Tambahkan banner pertama untuk hero slider storefront." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<Banner>
            rows={rows}
            onRowClick={openEdit}
            columns={[
              {
                header: "",
                className: "w-16",
                render: (b) => (
                  <div className="w-14 h-9 rounded-lg bg-white/50 overflow-hidden shrink-0">
                    {b.image_path ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl(b.image_path) ?? undefined} alt={b.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-[var(--color-ink-faint)]">
                        <ImageIcon size={14} />
                      </div>
                    )}
                  </div>
                ),
              },
              { header: "Judul", render: (b) => <span className="font-medium">{b.title}</span> },
              { header: "Subjudul", render: (b) => <span className="text-xs">{b.subtitle || "-"}</span> },
              { header: "Status", render: (b) => <Badge tone={b.is_active ? "success" : "neutral"}>{b.is_active ? "Aktif" : "Nonaktif"}</Badge> },
            ]}
          />
        )}
      </GlassCard>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Banner" : "Tambah Banner"}>
        <form onSubmit={handleSubmit} className="space-y-3">
          {formError && <ErrorState message={formError} />}

          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Gambar Banner</label>
            {imagePreview ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image ? imagePreview : (imageUrl(imagePreview) ?? undefined)}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white grid place-items-center"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--color-ink-faint)]/40 py-6 cursor-pointer hover:bg-white/40 transition">
                <ImageIcon size={20} className="text-[var(--color-ink-soft)]" />
                <span className="text-xs font-medium text-[var(--color-ink-soft)]">Pilih gambar (disarankan rasio lebar, mis. 1200x600)</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Judul</label>
            <GlassInput required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Subjudul</label>
            <GlassInput value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Link Tujuan (opsional)</label>
            <GlassInput
              value={form.link_url}
              onChange={(e) => setForm({ ...form, link_url: e.target.value })}
              placeholder="/toko/produk/1"
            />
          </div>

          <GradientButton type="submit" className="w-full mt-2" disabled={saving}>
            {saving ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Simpan Banner"}
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
}
