import { StoreNavbar } from "@/components/StoreNavbar";
import { StoreFooter } from "@/components/StoreFooter";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <StoreNavbar />
      <main className="px-4 py-6 lg:px-6 max-w-6xl mx-auto flex-1 w-full">{children}</main>
      <StoreFooter />
    </div>
  );
}
