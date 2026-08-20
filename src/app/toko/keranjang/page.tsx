"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { GlassCard, GradientButton, GhostButton } from "@/components/ui";
import { formatCurrency, imageUrl } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

export default function KeranjangPage() {
  const { items, updateQty, removeItem, totalPrice } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  function handleCheckout() {
    if (!user) {
      router.push("/login?redirect=/toko/checkout");
      return;
    }
    router.push("/toko/checkout");
  }

  if (items.length === 0) {
    return (
      <GlassCard className="flex flex-col items-center text-center gap-3 py-16 max-w-md mx-auto">
        <span className="w-14 h-14 rounded-2xl glass-pill grid place-items-center text-[var(--color-ink-faint)]">
          <ShoppingBag size={24} />
        </span>
        <p className="font-semibold text-sm">Keranjang kamu masih kosong</p>
        <p className="text-xs text-[var(--color-ink-soft)]">Yuk mulai belanja produk favoritmu.</p>
        <Link href="/toko" className="mt-2">
          <GradientButton>Lihat Produk</GradientButton>
        </Link>
      </GlassCard>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">Keranjang Belanja</h1>

      <GlassCard className="space-y-1">
        {items.map(({ product, qty }) => (
          <div key={product.id} className="flex items-center gap-3 py-3 border-b border-white/50 last:border-0">
            <div className="w-16 h-16 rounded-xl bg-white/40 shrink-0 overflow-hidden">
              {product.photo_path && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl(product.photo_path) ?? undefined} alt={product.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{product.name}</p>
              <p className="text-sm text-[var(--color-primary-1)] font-bold mt-0.5">
                {formatCurrency(product.display_price ?? product.base_price)}
              </p>
            </div>
            <div className="flex items-center glass-pill">
              <button onClick={() => updateQty(product.id, qty - 1)} className="w-7 h-7 grid place-items-center">
                <Minus size={12} />
              </button>
              <span className="w-6 text-center text-xs font-semibold">{qty}</span>
              <button onClick={() => updateQty(product.id, qty + 1)} className="w-7 h-7 grid place-items-center">
                <Plus size={12} />
              </button>
            </div>
            <button onClick={() => removeItem(product.id)} className="text-[var(--color-danger)] p-1">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </GlassCard>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[var(--color-ink-soft)]">Total Belanja</span>
          <span className="text-xl font-bold text-[var(--color-ink)]">{formatCurrency(totalPrice)}</span>
        </div>
        <GradientButton className="w-full" onClick={handleCheckout}>
          Lanjut ke Checkout
        </GradientButton>
        {!user && (
          <p className="text-[11px] text-[var(--color-ink-faint)] text-center mt-2">
            Kamu perlu masuk atau daftar akun dulu untuk menyelesaikan pesanan.
          </p>
        )}
      </GlassCard>

      <Link href="/toko">
        <GhostButton className="w-full">Lanjut Belanja</GhostButton>
      </Link>
    </div>
  );
}
