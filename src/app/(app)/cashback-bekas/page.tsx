import { Recycle } from "lucide-react";
import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Cashback Barang Bekas"
      description="Verifikasi buyback jerigen/kemasan bekas dan cashback otomatis."
      icon={Recycle}
    />
  );
}
