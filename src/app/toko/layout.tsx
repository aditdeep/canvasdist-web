import { StoreNavbar } from "@/components/StoreNavbar";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <StoreNavbar />
      <main className="px-4 py-6 lg:px-6 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
