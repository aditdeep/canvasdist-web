import { Package } from "lucide-react";
import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Produk"
      description="Kelola katalog produk, kategori, dan harga per level agen."
      icon={Package}
    />
  );
}
