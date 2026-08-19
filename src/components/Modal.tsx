"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong w-full sm:max-w-md max-h-[90vh] overflow-y-auto p-6 rounded-b-none sm:rounded-b-[18px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-[family-name:var(--font-manrope)] font-bold text-[15px]">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-full glass-pill grid place-items-center text-[var(--color-ink-soft)]"
          >
            <X size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
