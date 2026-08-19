import { FileBarChart } from "lucide-react";
import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Laporan"
      description="Performa sales, agen, produk terlaris, dan on-time delivery."
      icon={FileBarChart}
    />
  );
}
