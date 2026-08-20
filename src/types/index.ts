export type Role = "super_admin" | "wilayah" | "agen" | "reseller" | "sales" | "gudang" | "kurir" | "customer";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  parent_id: number | null;
  region_code: string | null;
  address: string | null;
  is_active: boolean;
  wallet?: Wallet;
  member_card?: MemberCard;
};

export type Region = {
  id: number;
  name: string;
  code: string;
  parent_region_id: number | null;
};

export type Product = {
  id: number;
  name: string;
  sku: string;
  category: string | null;
  unit: string;
  base_price: string;
  photo_path: string | null;
  description: string | null;
  display_price?: string;
  discounted_price?: string;
  promo_label?: string | null;
  shipping_fee?: string | null;
  is_active: boolean;
};

export type Outlet = {
  id: number;
  name: string;
  owner_name: string | null;
  phone: string | null;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  agent_id: number | null;
};

export type Visit = {
  id: number;
  sales_id: number;
  outlet_id: number;
  checkin_lat: string | null;
  checkin_lng: string | null;
  photo_path: string | null;
  notes: string | null;
  visited_at: string | null;
  outlet?: Outlet;
  sales?: User;
};

export type OrderStatus = "pending" | "approved" | "processing" | "shipped" | "completed" | "cancelled" | "returned";

export type OrderItem = {
  id: number;
  product_id: number;
  qty: number;
  price: string;
  discount: string;
  subtotal: string;
  product?: Product;
};

export type Order = {
  id: number;
  order_no: string;
  visit_id: number | null;
  outlet_id: number;
  agent_id: number | null;
  status: OrderStatus;
  payment_method: "cash" | "saldo" | "duitku";
  subtotal: string;
  discount_total: string;
  total: string;
  created_at: string;
  outlet?: Outlet;
  items?: OrderItem[];
};

export type Warehouse = {
  id: number;
  name: string;
  agent_id: number | null;
  address: string | null;
};

export type Stock = {
  id: number;
  warehouse_id: number;
  product_id: number;
  qty: number;
  warehouse?: Warehouse;
  product?: Product;
};

export type Hub = {
  id: number;
  name: string;
  type: "warehouse" | "agent_office" | "custom";
  warehouse_id: number | null;
  agent_id: number | null;
  address: string | null;
};

export type DeliveryLeg = {
  id: number;
  delivery_order_id: number;
  sequence: number;
  from_hub_id: number | null;
  to_hub_id: number | null;
  courier_id: number | null;
  status: "pending" | "in_transit" | "arrived";
  departed_at: string | null;
  arrived_at: string | null;
  from_hub?: Hub;
  to_hub?: Hub;
  courier?: User;
};

export type DeliveryOrder = {
  id: number;
  do_number: string;
  order_id: number;
  courier_id: number | null;
  status: "siap_kirim" | "dikirim" | "di_hub" | "sampai_tujuan" | "selesai";
  pod_photo_path: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  order?: Order;
  courier?: User;
  legs?: DeliveryLeg[];
};

export type Invoice = {
  id: number;
  invoice_no: string;
  order_id: number;
  amount: string;
  due_date: string | null;
  status: "unpaid" | "paid" | "overdue";
  order?: Order;
};

export type Promo = {
  id: number;
  name: string;
  type: "discount_percent" | "discount_fixed" | "tiered" | "points";
  value: string;
  min_qty: number | null;
  start_date: string;
  end_date: string;
  target_level: "wilayah" | "agen" | "reseller" | "outlet" | null;
  is_active: boolean;
};

export type Commission = {
  id: number;
  user_id: number;
  source_order_id: number;
  level: "wilayah" | "agen" | "reseller";
  percentage: string;
  amount: string;
  status: "pending" | "paid";
  paid_at: string | null;
  source_order?: Order;
};

export type Wallet = {
  id: number;
  user_id: number;
  balance: string;
};

export type WalletMutation = {
  id: number;
  wallet_id: number;
  type: "topup" | "payment" | "commission" | "cashback" | "refund";
  amount: string;
  balance_before: string;
  balance_after: string;
  reference: string | null;
  description: string | null;
  created_at: string;
};

export type Buyback = {
  id: number;
  visit_id: number | null;
  outlet_id: number;
  item_type: string;
  qty: number;
  unit_price: string;
  cashback_amount: string;
  photo_path: string | null;
  status: "pending" | "verified" | "rejected";
  outlet?: Outlet;
};

export type MemberCard = {
  id: number;
  user_id: number;
  card_number: string;
  qr_code: string;
  level: string;
};

export type PaymentMethod = {
  paymentMethod: string;
  paymentName: string;
  paymentImage: string;
  totalFee: string;
};

export type PaymentTransaction = {
  id: number;
  reference: string;
  gateway: string;
  order_id: number | null;
  wallet_id: number | null;
  amount: string;
  status: "pending" | "success" | "failed" | "expired";
  created_at: string;
};

export type Settings = {
  id: number;
  app_name: string;
  logo_path: string | null;
  owner_name: string | null;
  owner_email: string | null;
  owner_phone: string | null;
  platform_fee_percent: string;
  platform_owner_user_id: number | null;
  platform_owner?: User;
};

export type Paginated<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
};
