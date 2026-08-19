import { Users } from "lucide-react";
import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="User"
      description="Kelola akun admin, agen, sales, gudang, dan kurir."
      icon={Users}
    />
  );
}
