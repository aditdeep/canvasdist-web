"use client";

import Link from "next/link";
import { ShoppingCart, Package } from "lucide-react";
import { formatCurrency, imageUrl } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="glass overflow-hidden group">
      <Link href={`/toko/produk/${product.id}`} className="block">
        <div className="aspect-square bg-white/40 relative overflow-hidden">
          {product.photo_path ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl(product.photo_path) ?? undefined}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-[var(--color-ink-faint)]">
              <Package size={32} />
            </div>
          )}
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/toko/produk/${product.id}`}>
          <p className="text-sm font-semibold text-[var(--color-ink)] line-clamp-2 min-h-[2.5em]">{product.name}</p>
        </Link>
        <p className="text-sm font-bold text-[var(--color-primary-1)] mt-1">
          {formatCurrency(product.display_price ?? product.base_price)}
        </p>
        <button
          onClick={() => addItem(product, 1)}
          className="w-full mt-2.5 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-white transition active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2))" }}
        >
          <ShoppingCart size={13} /> Tambah
        </button>
      </div>
    </div>
  );
}
