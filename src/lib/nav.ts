import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Users,
  MapPinned,
  ClipboardList,
  Boxes,
  Truck,
  Wallet2,
  Tag,
  Network,
  Recycle,
  CreditCard,
  FileBarChart,
  Package,
  Store,
  Map,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Utama",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutGrid }],
  },
  {
    title: "Master Data",
    items: [
      { label: "Produk", href: "/master-data/produk", icon: Package },
      { label: "Outlet", href: "/master-data/outlet", icon: Store },
      { label: "Wilayah", href: "/master-data/wilayah", icon: Map },
      { label: "User", href: "/master-data/user", icon: Users },
    ],
  },
  {
    title: "Operasional",
    items: [
      { label: "Kunjungan Sales", href: "/canvasing/kunjungan", icon: MapPinned },
      { label: "Order", href: "/order", icon: ClipboardList },
      { label: "Inventory", href: "/inventory", icon: Boxes },
      { label: "Pengiriman", href: "/pengiriman", icon: Truck },
      { label: "Piutang", href: "/piutang", icon: FileBarChart },
    ],
  },
  {
    title: "Program & Keuangan",
    items: [
      { label: "Promo & Reward", href: "/promo", icon: Tag },
      { label: "Komisi Jaringan", href: "/komisi", icon: Network },
      { label: "Saldo", href: "/saldo", icon: Wallet2 },
      { label: "Cashback Bekas", href: "/cashback-bekas", icon: Recycle },
      { label: "Payment", href: "/payment", icon: CreditCard },
    ],
  },
  {
    title: "Laporan",
    items: [{ label: "Laporan", href: "/laporan", icon: FileBarChart }],
  },
];

// 5 item paling sering dipakai untuk bottom nav mobile
export const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: LayoutGrid },
  { label: "Order", href: "/order", icon: ClipboardList },
  { label: "Kirim", href: "/pengiriman", icon: Truck },
  { label: "Saldo", href: "/saldo", icon: Wallet2 },
  { label: "Lainnya", href: "/menu", icon: Users },
];
