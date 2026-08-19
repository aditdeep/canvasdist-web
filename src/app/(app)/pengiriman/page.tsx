import { Truck } from "lucide-react";
import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Pengiriman & Tracking"
      description="Surat Jalan, assign kurir, dan tracking posisi pengiriman."
      icon={Truck}
    />
  );
}
