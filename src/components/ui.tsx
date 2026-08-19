import type { ReactNode, InputHTMLAttributes, ButtonHTMLAttributes } from "react";

export function GlassCard({
  children,
  className = "",
  strong = false,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
}) {
  return <div className={`${strong ? "glass-strong" : "glass"} p-5 ${className}`}>{children}</div>;
}

export function GlassInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full rounded-xl bg-white/50 border border-white/70 px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] outline-none transition focus:bg-white/80 focus:border-[var(--color-primary-1)]/50 ${className}`}
    />
  );
}

export function GradientButton({
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(91,95,240,0.35)] transition active:scale-[0.98] hover:brightness-105 disabled:opacity-50 disabled:pointer-events-none ${className}`}
      style={{ background: "linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2))" }}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-[var(--color-ink)] glass-pill transition active:scale-[0.98] hover:bg-white/80 disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "primary",
}: {
  children: ReactNode;
  tone?: "primary" | "success" | "warning" | "danger" | "neutral";
}) {
  const tones: Record<string, string> = {
    primary: "bg-[var(--color-primary-1)]/12 text-[var(--color-primary-1)]",
    success: "bg-[var(--color-success)]/12 text-[var(--color-success)]",
    warning: "bg-[var(--color-warning)]/14 text-[var(--color-warning)]",
    danger: "bg-[var(--color-danger)]/12 text-[var(--color-danger)]",
    neutral: "bg-[var(--color-ink)]/8 text-[var(--color-ink-soft)]",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
