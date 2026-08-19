import { Network } from "lucide-react";
import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Komisi Jaringan"
      description="Komisi berjenjang wilayah, agen, dan reseller."
      icon={Network}
    />
  );
}
