import type { LucideIcon } from "lucide-react";
import type { Role } from "@/types";
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
  Waypoints,
  Settings,
  ImageIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Role yang boleh lihat menu ini. Kosong/undefined = semua role. */
  roles?: Role[];
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
      { label: "Produk", href: "/master-data/produk", icon: Package, roles: ["super_admin", "wilayah", "agen", "sales", "reseller", "gudang"] },
      { label: "Kategori", href: "/master-data/kategori", icon: ImageIcon, roles: ["super_admin", "wilayah", "agen"] },
      { label: "Outlet", href: "/master-data/outlet", icon: Store, roles: ["super_admin", "wilayah", "agen", "sales"] },
      { label: "Wilayah", href: "/master-data/wilayah", icon: Map, roles: ["super_admin", "wilayah"] },
      { label: "Hub", href: "/master-data/hub", icon: Waypoints, roles: ["super_admin", "wilayah", "agen", "gudang"] },
      { label: "User", href: "/master-data/user", icon: Users, roles: ["super_admin"] },
    ],
  },
  {
    title: "Operasional",
    items: [
      { label: "Kunjungan Sales", href: "/canvasing/kunjungan", icon: MapPinned, roles: ["super_admin", "wilayah", "agen", "sales"] },
      { label: "Order", href: "/order", icon: ClipboardList, roles: ["super_admin", "wilayah", "agen", "sales", "reseller"] },
      { label: "Inventory", href: "/inventory", icon: Boxes, roles: ["super_admin", "wilayah", "agen", "gudang"] },
      { label: "Pengiriman", href: "/pengiriman", icon: Truck, roles: ["super_admin", "wilayah", "agen", "gudang", "kurir"] },
      { label: "Piutang", href: "/piutang", icon: FileBarChart, roles: ["super_admin", "wilayah", "agen"] },
    ],
  },
  {
    title: "Program & Keuangan",
    items: [
      { label: "Promo & Reward", href: "/promo", icon: Tag, roles: ["super_admin", "wilayah", "agen"] },
      { label: "Banner Hero", href: "/banner", icon: ImageIcon, roles: ["super_admin"] },
      { label: "Komisi Jaringan", href: "/komisi", icon: Network, roles: ["super_admin", "wilayah", "agen", "reseller"] },
      { label: "Saldo", href: "/saldo", icon: Wallet2 },
      { label: "Cashback Bekas", href: "/cashback-bekas", icon: Recycle, roles: ["super_admin", "wilayah", "agen", "sales", "gudang"] },
      { label: "Payment", href: "/payment", icon: CreditCard },
    ],
  },
  {
    title: "Laporan",
    items: [{ label: "Laporan", href: "/laporan", icon: FileBarChart, roles: ["super_admin", "wilayah", "agen"] }],
  },
  {
    title: "Sistem",
    items: [{ label: "Pengaturan", href: "/pengaturan", icon: Settings, roles: ["super_admin"] }],
  },
];

/** Kembalikan NAV_GROUPS yang sudah difilter sesuai role, grup kosong ikut dibuang. */
export function navGroupsForRole(role: Role): NavGroup[] {
  return NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.roles || item.roles.includes(role)),
  })).filter((group) => group.items.length > 0);
}

// 5 item paling sering dipakai untuk bottom nav mobile — tetap sama untuk semua role
// karena mewakili 4 alur inti + akses ke menu lengkap yang sudah difilter per role.
export const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: LayoutGrid },
  { label: "Order", href: "/order", icon: ClipboardList },
  { label: "Kirim", href: "/pengiriman", icon: Truck },
  { label: "Saldo", href: "/saldo", icon: Wallet2 },
  { label: "Lainnya", href: "/menu", icon: Users },
];
