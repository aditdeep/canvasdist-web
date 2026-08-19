import { MapPinned } from "lucide-react";
import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Kunjungan Sales"
      description="Monitor kunjungan canvasing sales ke outlet secara real-time."
      icon={MapPinned}
    />
  );
}
