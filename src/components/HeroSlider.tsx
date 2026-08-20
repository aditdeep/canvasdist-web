"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetcher, imageUrl } from "@/lib/api";
import type { Banner } from "@/types";

type Slide = {
  title: string;
  subtitle: string;
  image: string | null;
  gradient: string;
  link_url: string | null;
};

const FALLBACK_SLIDES: Slide[] = [
  {
    title: "Belanja Langsung dari Agen Terdekat",
    subtitle: "Produk dikirim oleh agen di wilayah kamu, cepat dan terpercaya.",
    gradient: "linear-gradient(135deg, #5b5ff0, #9b6bf2)",
    image: null,
    link_url: null,
  },
  {
    title: "Promo & Diskon Setiap Minggu",
    subtitle: "Cek koleksi produk pilihan dengan harga terbaik dari jaringan kami.",
    gradient: "linear-gradient(135deg, #d9a441, #f2994a)",
    image: null,
    link_url: null,
  },
  {
    title: "Ambil Sendiri atau Diantar",
    subtitle: "Pilih cara terima pesanan sesuai kenyamanan kamu saat checkout.",
    gradient: "linear-gradient(135deg, #12b886, #5b5ff0)",
    image: null,
    link_url: null,
  },
];

export function HeroSlider() {
  const { data: banners } = useSWR<Banner[]>("/public/banners", fetcher);
  const [index, setIndex] = useState(0);

  const slides: Slide[] =
    banners && banners.length > 0
      ? banners.map((b) => ({
          title: b.title,
          subtitle: b.subtitle ?? "",
          image: b.image_path,
          gradient: "linear-gradient(135deg, #5b5ff0, #9b6bf2)",
          link_url: b.link_url,
        }))
      : FALLBACK_SLIDES;

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[index] ?? slides[0];

  const background = slide.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageUrl(slide.image) ?? undefined} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />
  ) : (
    <div className="absolute inset-0" style={{ background: slide.gradient }} />
  );

  return (
    <div className="relative rounded-[28px] overflow-hidden h-56 sm:h-64 lg:h-72 mb-8">
      {slide.link_url ? (
        <Link href={slide.link_url} className="absolute inset-0 block">
          {background}
        </Link>
      ) : (
        background
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10 pointer-events-none" />

      <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 text-white max-w-lg pointer-events-none">
        <h2 className="font-[family-name:var(--font-manrope)] text-xl sm:text-2xl font-extrabold leading-tight">
          {slide.title}
        </h2>
        {slide.subtitle && <p className="text-sm text-white/85 mt-2">{slide.subtitle}</p>}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur grid place-items-center text-white transition"
            aria-label="Sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur grid place-items-center text-white transition"
            aria-label="Berikutnya"
          >
            <ChevronRight size={16} />
          </button>

          <div className="absolute bottom-3 right-4 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
