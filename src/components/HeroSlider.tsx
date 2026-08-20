"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  title: string;
  subtitle: string;
  gradient: string;
};

const SLIDES: Slide[] = [
  {
    title: "Belanja Langsung dari Agen Terdekat",
    subtitle: "Produk dikirim oleh agen di wilayah kamu, cepat dan terpercaya.",
    gradient: "linear-gradient(135deg, #5b5ff0, #9b6bf2)",
  },
  {
    title: "Promo & Diskon Setiap Minggu",
    subtitle: "Cek koleksi produk pilihan dengan harga terbaik dari jaringan kami.",
    gradient: "linear-gradient(135deg, #d9a441, #f2994a)",
  },
  {
    title: "Ambil Sendiri atau Diantar",
    subtitle: "Pilih cara terima pesanan sesuai kenyamanan kamu saat checkout.",
    gradient: "linear-gradient(135deg, #12b886, #5b5ff0)",
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[index];

  return (
    <div className="relative rounded-[28px] overflow-hidden h-56 sm:h-64 lg:h-72 mb-8">
      <div className="absolute inset-0 transition-all duration-700" style={{ background: slide.gradient }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10" />

      <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 text-white max-w-lg">
        <h2 className="font-[family-name:var(--font-manrope)] text-xl sm:text-2xl font-extrabold leading-tight">
          {slide.title}
        </h2>
        <p className="text-sm text-white/85 mt-2">{slide.subtitle}</p>
      </div>

      <button
        onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur grid place-items-center text-white transition"
        aria-label="Sebelumnya"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur grid place-items-center text-white transition"
        aria-label="Berikutnya"
      >
        <ChevronRight size={16} />
      </button>

      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
