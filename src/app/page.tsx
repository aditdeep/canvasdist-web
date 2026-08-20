import { redirect } from "next/navigation";

export default function RootPage() {
  // Root domain diarahkan ke storefront publik (bisa browsing tanpa login).
  // Dashboard internal (admin/agen/sales/dst) tetap di /login → /dashboard.
  redirect("/toko");
}
