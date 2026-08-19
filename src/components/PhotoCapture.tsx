"use client";

import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";

export function PhotoCapture({
  onChange,
  label = "Ambil Foto",
}: {
  onChange: (file: File | null) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  function clear() {
    onChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
        id="photo-capture-input"
      />
      {!preview ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--color-ink-faint)]/40 py-6 text-[var(--color-ink-soft)] hover:bg-white/50 transition"
        >
          <Camera size={20} />
          <span className="text-xs font-medium">{label}</span>
        </button>
      ) : (
        <div className="relative rounded-xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview foto" className="w-full h-40 object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white grid place-items-center"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
