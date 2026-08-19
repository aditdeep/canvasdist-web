import { Store } from "lucide-react";
import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Outlet"
      description="Data toko/customer beserta lokasi dan agen penanggung jawab."
      icon={Store}
    />
  );
}
