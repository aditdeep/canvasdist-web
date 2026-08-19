import { Tag } from "lucide-react";
import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Promo, Diskon & Reward"
      description="Kelola promo produk, diskon berjenjang, dan reward poin."
      icon={Tag}
    />
  );
}
