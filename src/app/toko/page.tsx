"use client";

import { useState } from "react";
import useSWR from "swr";
import { Tag, Truck, ShieldCheck, ImageIcon } from "lucide-react";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductCard } from "@/components/ProductCard";
import { GlassCard } from "@/components/ui";
import { fetcher, imageUrl } from "@/lib/api";
import type { Category, Paginated, Product } from "@/types";

const PERKS = [
  { icon: Truck, title: "Diantar atau Ambil Sendiri", desc: "Pilih cara terima sesuai kenyamananmu" },
  { icon: ShieldCheck, title: "Agen Terverifikasi", desc: "Dikirim langsung dari agen resmi terdekat" },
  { icon: Tag, title: "Harga Transparan", desc: "Tanpa biaya tersembunyi saat checkout" },
];

export default function StorefrontHomePage() {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const { data: categories } = useSWR<Category[]>("/public/categories", fetcher);
  const { data, isLoading } = useSWR<Paginated<Product>>(
    `/public/products${categoryId ? `?category_id=${categoryId}` : ""}`,
    fetcher
  );

  const products = data?.data ?? [];
  const activeCategoryName = categories?.find((c) => c.id === categoryId)?.name;

  return (
    <div>
      <HeroSlider />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {PERKS.map((perk) => (
          <GlassCard key={perk.title} className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl glass-pill grid place-items-center text-[var(--color-primary-1)] shrink-0">
              <perk.icon size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)]">{perk.title}</p>
              <p className="text-xs text-[var(--color-ink-soft)]">{perk.desc}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {categories && categories.length > 0 && (
        <div className="mb-8">
          <h2 className="font-[family-name:var(--font-manrope)] font-bold text-lg mb-3">Kategori Produk</h2>
          <div className="flex gap-4 overflow-x-auto pb-1">
            <button onClick={() => setCategoryId(null)} className="flex flex-col items-center gap-1.5 shrink-0">
              <span
                className={`w-16 h-16 rounded-full grid place-items-center transition ${
                  !categoryId ? "text-white" : "glass-pill text-[var(--color-ink)]"
                }`}
                style={!categoryId ? { background: "linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2))" } : undefined}
              >
                <ImageIcon size={22} />
              </span>
              <span className={`text-[11px] font-medium ${!categoryId ? "text-[var(--color-primary-1)]" : "text-[var(--color-ink-soft)]"}`}>
                Semua
              </span>
            </button>

            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setCategoryId(cat.id)} className="flex flex-col items-center gap-1.5 shrink-0">
                <span
                  className={`w-16 h-16 rounded-full overflow-hidden grid place-items-center transition ${
                    categoryId === cat.id ? "ring-2 ring-[var(--color-primary-1)]" : "glass-pill"
                  }`}
                >
                  {cat.image_path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl(cat.image_path) ?? undefined} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={20} className="text-[var(--color-ink-faint)]" />
                  )}
                </span>
                <span
                  className={`text-[11px] font-medium max-w-16 truncate ${
                    categoryId === cat.id ? "text-[var(--color-primary-1)]" : "text-[var(--color-ink-soft)]"
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <h2 className="font-[family-name:var(--font-manrope)] font-bold text-lg mb-3">
        {activeCategoryName ?? "Semua Produk"}
      </h2>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4.2] rounded-2xl bg-white/40 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <GlassCard className="text-center py-16">
          <p className="text-sm text-[var(--color-ink-soft)]">Belum ada produk di kategori ini.</p>
        </GlassCard>
      )}

      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
