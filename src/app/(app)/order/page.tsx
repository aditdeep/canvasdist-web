import { ClipboardList } from "lucide-react";
import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Order"
      description="Kelola order masuk dari canvasing hingga approval."
      icon={ClipboardList}
    />
  );
}
