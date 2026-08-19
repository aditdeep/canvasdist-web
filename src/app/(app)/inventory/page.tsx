import { Boxes } from "lucide-react";
import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Inventory"
      description="Stok produk per gudang/agen dan mutasi antar gudang."
      icon={Boxes}
    />
  );
}
