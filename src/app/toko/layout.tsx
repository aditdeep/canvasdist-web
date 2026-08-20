import { StoreNavbar } from "@/components/StoreNavbar";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreBottomNav } from "@/components/StoreBottomNav";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <StoreNavbar />
      <main className="px-4 py-6 lg:px-6 max-w-6xl mx-auto flex-1 w-full pb-24 md:pb-6">{children}</main>
      <div className="hidden md:block">
        <StoreFooter />
      </div>
      <StoreBottomNav />
    </div>
  );
}
