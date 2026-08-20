"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, ImageIcon, X } from "lucide-react";
import { GlassCard, GradientButton, GlassInput, Badge } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { api, fetcher, imageUrl, ApiError } from "@/lib/api";
import type { Paginated, Category } from "@/types";

export default function KategoriPage() {
  const { data, error, isLoading, mutate } = useSWR<Paginated<Category>>("/categories", fetcher);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setName("");
    setImage(null);
    setImagePreview(null);
    setFormError(null);
    setOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setName(category.name);
    setImage(null);
    setImagePreview(category.image_path);
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
      formData.append("name", name);
      if (image) formData.append("image", image);

      if (editing) {
        formData.append("_method", "PUT");
        await api.postForm(`/categories/${editing.id}`, formData);
      } else {
        await api.postForm("/categories", formData);
      }

      setOpen(false);
      mutate();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal menyimpan kategori");
    } finally {
      setSaving(false);
    }
  }

  const rows = data?.data ?? [];

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Kategori</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">
            Kategori produk dengan gambar — tampil sebagai ikon kategori di storefront.
          </p>
        </div>
        <GradientButton onClick={openCreate} className="shrink-0">
          <Plus size={16} /> Tambah
        </GradientButton>
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data kategori." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={ImageIcon} title="Belum ada kategori" description="Tambahkan kategori pertama untuk mengelompokkan produk." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<Category>
            rows={rows}
            onRowClick={openEdit}
            columns={[
              {
                header: "",
                className: "w-12",
                render: (c) => (
                  <div className="w-10 h-10 rounded-full bg-white/50 overflow-hidden shrink-0">
                    {c.image_path ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl(c.image_path) ?? undefined} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-[var(--color-ink-faint)]">
                        <ImageIcon size={16} />
                      </div>
                    )}
                  </div>
                ),
              },
              { header: "Nama Kategori", render: (c) => <span className="font-medium">{c.name}</span> },
              { header: "Status", render: (c) => <Badge tone={c.is_active ? "success" : "neutral"}>{c.is_active ? "Aktif" : "Nonaktif"}</Badge> },
            ]}
          />
        )}
      </GlassCard>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Kategori" : "Tambah Kategori"}>
        <form onSubmit={handleSubmit} className="space-y-3">
          {formError && <ErrorState message={formError} />}

          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Gambar Kategori</label>
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
                <span className="text-xs font-medium text-[var(--color-ink-soft)]">Pilih gambar</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Nama Kategori</label>
            <GlassInput required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <GradientButton type="submit" className="w-full mt-2" disabled={saving}>
            {saving ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Simpan Kategori"}
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
}
