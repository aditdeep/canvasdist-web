# CanvasDist Web

Dashboard web (Next.js) untuk aplikasi Canvasing & Distribusi Produk.
Role yang dilayani: Super Admin, Agen/Distributor, Gudang.

## Modul
- Master Data (produk, outlet, wilayah, user)
- Canvasing (monitor kunjungan sales)
- Order Management
- Inventory / Stok
- Pengiriman & Tracking
- Piutang & Pembayaran
- Promo, Diskon & Reward
- Komisi Jaringan (Wilayah/Agen/Reseller)
- Saldo (deposit & mutasi)
- Cashback Barang Bekas
- Payment Gateway (Duitku)
- Laporan

## Desain

Gaya visual: **glassmorphism ala Apple** (frosted glass, mesh gradient background, blur + saturate).

- Token warna & utility class glass ada di `src/app/globals.css` (`.glass`, `.glass-strong`, `.glass-pill`, `.mesh-bg`)
- Font: **Manrope** (display/heading), **Inter** (body/UI), **JetBrains Mono** (angka, nomor kartu, kode referensi)
- Signature element: `src/components/MemberCard.tsx` — kartu member digital ala ATM (mirip Livin by Mandiri), dengan efek holografik mengikuti kursor
- Layout: `Sidebar` (desktop, kaca, di `src/components/Sidebar.tsx`) + `BottomNav` (mobile, di `src/components/BottomNav.tsx`) — otomatis terpasang lewat `src/app/(app)/layout.tsx` untuk semua halaman kecuali `/login`
- Sudah mobile-friendly dari awal; struktur ini siap dilanjutkan ke **PWA** (`public/manifest.json` sudah disiapkan, tinggal tambah service worker) atau **Expo/React Native** (reuse token warna & komponen sebagai referensi, bukan copy langsung karena beda platform)

> Catatan: font di-fetch dari Google Fonts saat build (`next/font/google`) — butuh akses internet saat `npm run build`/deploy (aman di Vercel). Icon PWA di `manifest.json` masih placeholder favicon, ganti dengan ikon 192x192 & 512x512 sebelum production.

## Setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` di `.env.local` ke URL backend `canvasdist-api` (mis. `http://localhost:8000/api` lokal, atau URL production nanti).

## Status koneksi API

Semua halaman berikut sudah terhubung penuh ke `canvasdist-api` (bukan data dummy):
Login, Dashboard, Produk, Outlet, Wilayah, User, Kunjungan Sales (checkin GPS asli),
Order (list + approve), Inventory (stok + mutasi), Pengiriman (update status),
Piutang, Promo, Komisi Jaringan (list + payout), Cashback Barang Bekas (input + verifikasi),
Saldo (wallet + mutasi + top up Duitku + member card asli), Payment (riwayat transaksi), Laporan.

Backend API: lihat repo `canvasdist-api`.
Dokumentasi lengkap alur bisnis: lihat repo `canvasdist-docs`.
