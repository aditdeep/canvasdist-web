import { CreditCard } from "lucide-react";
import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Payment Gateway"
      description="Transaksi pembayaran via Duitku — VA, e-wallet, QRIS."
      icon={CreditCard}
    />
  );
}
