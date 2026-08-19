import { FileBarChart } from "lucide-react";
import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Piutang & Pembayaran"
      description="Invoice, termin, dan rekap piutang outlet."
      icon={FileBarChart}
    />
  );
}
