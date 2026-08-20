"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, Package, Pencil, X } from "lucide-react";
import { GlassCard, GradientButton, GlassInput, Badge } from "@/components/ui";
import { DataTable, EmptyState, LoadingRows, ErrorState } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { api, fetcher, formatCurrency, ApiError } from "@/lib/api";
import { canWrite } from "@/lib/permissions";
import { useAuth } from "@/lib/auth-context";
import type { Paginated, Product } from "@/types";

const EMPTY_FORM = { name: "", sku: "", category: "", unit: "pcs", base_price: "", description: "" };

export default function ProdukPage() {
  const { user } = useAuth();
  const { data, error, isLoading, mutate } = useSWR<Paginated<Product>>("/products", fetcher);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const canEdit = canWrite("produk", user?.role);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setPhoto(null);
    setPhotoPreview(null);
    setFormError(null);
    setOpen(true);
  }

  function openEdit(product: Product) {
    if (!canEdit) return;
    setEditing(product);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category ?? "",
      unit: product.unit,
      base_price: product.base_price,
      description: product.description ?? "",
    });
    setPhoto(null);
    setPhotoPreview(product.photo_path);
    setFormError(null);
    setOpen(true);
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhoto(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : editing?.photo_path ?? null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("sku", form.sku);
      formData.append("category", form.category);
      formData.append("unit", form.unit);
      formData.append("base_price", form.base_price);
      formData.append("description", form.description);
      if (photo) formData.append("photo", photo);

      if (editing) {
        formData.append("_method", "PUT");
        await api.postForm(`/products/${editing.id}`, formData);
      } else {
        await api.postForm("/products", formData);
      }

      setOpen(false);
      mutate();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal menyimpan produk");
    } finally {
      setSaving(false);
    }
  }

  const rows = data?.data ?? [];

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Produk</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">
            Katalog produk, foto, dan harga — ini juga yang tampil di storefront customer.
          </p>
        </div>
        {canEdit && (
          <GradientButton onClick={openCreate} className="shrink-0">
            <Plus size={16} /> Tambah
          </GradientButton>
        )}
      </div>

      <GlassCard>
        {isLoading && <LoadingRows />}
        {error && <ErrorState message="Gagal memuat data produk. Pastikan API sudah jalan & dikonfigurasi." />}
        {!isLoading && !error && rows.length === 0 && (
          <EmptyState icon={Package} title="Belum ada produk" description="Tambahkan produk pertama kamu untuk mulai jualan." />
        )}
        {!isLoading && rows.length > 0 && (
          <DataTable<Product>
            rows={rows}
            onRowClick={canEdit ? openEdit : undefined}
            columns={[
              {
                header: "",
                className: "w-12",
                render: (p) => (
                  <div className="w-10 h-10 rounded-lg bg-white/50 overflow-hidden shrink-0">
                    {p.photo_path ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.photo_path} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-[var(--color-ink-faint)]">
                        <Package size={16} />
                      </div>
                    )}
                  </div>
                ),
              },
              { header: "Nama", render: (p) => <span className="font-medium">{p.name}</span> },
              { header: "SKU", render: (p) => <span className="font-[family-name:var(--font-jbmono)] text-xs">{p.sku}</span> },
              { header: "Kategori", render: (p) => p.category || "-" },
              { header: "Harga Dasar", render: (p) => formatCurrency(p.base_price) },
              { header: "Status", render: (p) => <Badge tone={p.is_active ? "success" : "neutral"}>{p.is_active ? "Aktif" : "Nonaktif"}</Badge> },
              canEdit
                ? { header: "", render: () => <Pencil size={14} className="text-[var(--color-ink-faint)]" /> }
                : { header: "", render: () => null },
            ]}
          />
        )}
      </GlassCard>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Produk" : "Tambah Produk"}>
        <form onSubmit={handleSubmit} className="space-y-3">
          {formError && <ErrorState message={formError} />}

          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Foto Produk</label>
            {photoPreview ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoPreview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(null);
                    setPhotoPreview(null);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white grid place-items-center"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--color-ink-faint)]/40 py-6 cursor-pointer hover:bg-white/40 transition">
                <Package size={20} className="text-[var(--color-ink-soft)]" />
                <span className="text-xs font-medium text-[var(--color-ink-soft)]">Pilih foto produk</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Nama Produk</label>
            <GlassInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">SKU</label>
            <GlassInput required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Kategori</label>
            <GlassInput value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Satuan</label>
              <GlassInput value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Harga Dasar</label>
              <GlassInput
                type="number"
                required
                value={form.base_price}
                onChange={(e) => setForm({ ...form, base_price: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-ink-soft)] mb-1.5 block">Deskripsi (tampil di storefront)</label>
            <textarea
              className="w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm outline-none focus:bg-white/80 min-h-20"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Deskripsi singkat produk untuk customer..."
            />
          </div>
          <GradientButton type="submit" className="w-full mt-2" disabled={saving}>
            {saving ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Simpan Produk"}
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
}
