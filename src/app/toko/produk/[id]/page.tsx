"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { ArrowLeft, Minus, Plus, Package, ShoppingCart, Tag, Truck } from "lucide-react";
import { GlassCard, GradientButton } from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";
import { fetcher, formatCurrency, imageUrl } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/types";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { data, isLoading } = useSWR<{ product: Product; related: Product[] }>(
    `/public/products/${params.id}`,
    fetcher
  );
  const [qty, setQty] = useState(1);

  if (isLoading) {
    return <div className="h-96 rounded-2xl bg-white/40 animate-pulse" />;
  }

  const product = data?.product;
  const related = data?.related ?? [];

  if (!product) {
    return (
      <GlassCard className="text-center py-16">
        <p className="text-sm text-[var(--color-ink-soft)]">Produk tidak ditemukan.</p>
      </GlassCard>
    );
  }

  const hasPromo = product.promo_label && Number(product.discounted_price) < Number(product.display_price);
  const finalPrice = hasPromo ? product.discounted_price! : (product.display_price ?? product.base_price);

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-[var(--color-ink-soft)] mb-4"
      >
        <ArrowLeft size={16} /> Kembali
      </button>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="aspect-square rounded-2xl overflow-hidden bg-white/40">
          {product.photo_path ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl(product.photo_path) ?? undefined} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-[var(--color-ink-faint)]">
              <Package size={48} />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            {product.category && (
              <span className="inline-block text-xs font-semibold text-[var(--color-primary-1)] bg-[var(--color-primary-1)]/10 rounded-full px-3 py-1">
                {product.category}
              </span>
            )}
            {hasPromo && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-[var(--color-danger)] rounded-full px-3 py-1">
                <Tag size={11} /> {product.promo_label}
              </span>
            )}
          </div>

          <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[var(--color-ink)]">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl font-bold text-[var(--color-primary-1)]">
              {formatCurrency(finalPrice)}
              <span className="text-sm font-normal text-[var(--color-ink-soft)]"> / {product.unit}</span>
            </p>
            {hasPromo && (
              <p className="text-sm text-[var(--color-ink-faint)] line-through">{formatCurrency(product.display_price!)}</p>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-[var(--color-ink-soft)] mt-4 leading-relaxed">{product.description}</p>
          )}

          <div className="flex items-center gap-2 mt-4 text-xs text-[var(--color-ink-soft)]">
            <Truck size={14} className="text-[var(--color-primary-1)]" />
            {product.shipping_fee !== null && product.shipping_fee !== undefined ? (
              <span>
                Ongkir ke wilayahmu:{" "}
                <span className="font-semibold text-[var(--color-ink)]">
                  {Number(product.shipping_fee) === 0 ? "Gratis" : formatCurrency(product.shipping_fee)}
                </span>
              </span>
            ) : (
              <span>Ongkir dihitung berdasarkan wilayah setelah kamu masuk/daftar akun.</span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center glass-pill">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 grid place-items-center text-[var(--color-ink)]"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 grid place-items-center text-[var(--color-ink)]">
                <Plus size={14} />
              </button>
            </div>

            <GradientButton className="flex-1" onClick={() => addItem(product, qty)}>
              <ShoppingCart size={16} /> Tambah ke Keranjang
            </GradientButton>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="font-[family-name:var(--font-manrope)] font-bold text-lg mb-4">Produk Terkait</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
