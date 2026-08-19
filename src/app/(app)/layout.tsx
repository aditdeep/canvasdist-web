"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/lib/auth-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="glass-pill px-4 py-2 text-sm text-[var(--color-ink-soft)]">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar userName={user.name} role={roleLabel(user.role)} />
        <main className="px-4 py-5 lg:px-6 pb-28 lg:pb-8">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}

function roleLabel(role: string): string {
  const map: Record<string, string> = {
    super_admin: "Super Admin",
    wilayah: "Wilayah",
    agen: "Agen",
    reseller: "Reseller",
    sales: "Sales",
    gudang: "Gudang",
    kurir: "Kurir",
  };
  return map[role] ?? role;
}
