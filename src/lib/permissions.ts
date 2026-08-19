import type { Role } from "@/types";

const WRITE_PERMISSIONS: Record<string, Role[]> = {
  produk: ["super_admin", "wilayah", "agen"],
  wilayah: ["super_admin", "wilayah"],
  user: ["super_admin"],
  promo: ["super_admin", "wilayah", "agen"],
};

export function canWrite(module: keyof typeof WRITE_PERMISSIONS, role: Role | undefined): boolean {
  if (!role) return false;
  return WRITE_PERMISSIONS[module].includes(role);
}
