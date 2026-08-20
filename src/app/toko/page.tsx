"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { Tag, Truck, ShieldCheck } from "lucide-react";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductCard } from "@/components/ProductCard";
import { GlassCard } from "@/components/ui";
import { fetcher } from "@/lib/api";
import type { Paginated, Product } from "@/types";

const PERKS = [
  { icon: Truck, title: "Diantar atau Ambil Sendiri", desc: "Pilih cara terima sesuai kenyamananmu" },
  { icon: ShieldCheck, title: "Agen Terverifikasi", desc: "Dikirim langsung dari agen resmi terdekat" },
  { icon: Tag, title: "Harga Transparan", desc: "Tanpa biaya tersembunyi saat checkout" },
];

export default function StorefrontHomePage() {
  const [category, setCategory] = useState<string | null>(null);
  const { data, isLoading } = useSWR<Paginated<Product>>(
    `/public/products${category ? `?category=${encodeURIComponent(category)}` : ""}`,
    fetcher
  );

  const { data: allProducts } = useSWR<Paginated<Product>>("/public/products", fetcher);
  const categories = useMemo(() => {
    const set = new Set<string>();
    (allProducts?.data ?? []).forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [allProducts]);

  const products = data?.data ?? [];

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

      {categories.length > 0 && (
        <div className="mb-6">
          <h2 className="font-[family-name:var(--font-manrope)] font-bold text-lg mb-3">Kategori Produk</h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setCategory(null)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                !category ? "text-white" : "glass-pill text-[var(--color-ink)]"
              }`}
              style={!category ? { background: "linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2))" } : undefined}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  category === cat ? "text-white" : "glass-pill text-[var(--color-ink)]"
                }`}
                style={
                  category === cat
                    ? { background: "linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2))" }
                    : undefined
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <h2 className="font-[family-name:var(--font-manrope)] font-bold text-lg mb-3">
        {category ?? "Semua Produk"}
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
