import { GlassCard } from "@/components/ui";

export const metadata = {
  title: "Kebijakan Privasi — CanvasDist",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <GlassCard strong className="p-6 sm:p-8 space-y-5 text-sm text-[var(--color-ink)] leading-relaxed">
          <div>
            <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold mb-1">Kebijakan Privasi CanvasDist</h1>
            <p className="text-xs text-[var(--color-ink-soft)]">Terakhir diperbarui: 19 Agustus 2026</p>
          </div>

          <p>
            CanvasDist (&quot;kami&quot;) menyediakan aplikasi web dan mobile untuk pengelolaan canvasing, distribusi,
            dan pengiriman produk. Kebijakan ini menjelaskan data apa saja yang kami kumpulkan dari pengguna
            aplikasi (Admin, Agen, Sales, Gudang, Kurir, dan Reseller) serta bagaimana data tersebut digunakan.
          </p>

          <section>
            <h2 className="font-semibold text-base mb-2">1. Data yang Kami Kumpulkan</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Data akun:</strong> nama, email, nomor telepon, dan role/peran dalam sistem.</li>
              <li>
                <strong>Data lokasi (GPS):</strong> dikumpulkan saat Sales melakukan checkin kunjungan ke outlet,
                dan saat Kurir melakukan pengiriman/tracking. Lokasi hanya diambil saat pengguna secara aktif
                menggunakan fitur tersebut, bukan dilacak secara terus-menerus di latar belakang.
              </li>
              <li>
                <strong>Foto:</strong> foto yang diambil pengguna untuk keperluan checkin kunjungan, bukti terima
                barang (POD), dan verifikasi barang bekas (buyback).
              </li>
              <li>
                <strong>Data transaksi:</strong> riwayat order, saldo, mutasi wallet, dan komisi jaringan yang
                terhubung dengan akun pengguna.
              </li>
              <li>
                <strong>Data pembayaran:</strong> saat melakukan top-up saldo, transaksi diproses oleh mitra
                payment gateway pihak ketiga (Duitku). Kami tidak menyimpan data kartu/rekening bank pengguna;
                data tersebut dikelola langsung oleh Duitku sesuai kebijakan privasi mereka.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">2. Bagaimana Data Digunakan</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Menjalankan fungsi inti aplikasi: canvasing, order, pengiriman, saldo, dan komisi jaringan.</li>
              <li>Verifikasi kunjungan sales dan bukti pengiriman (anti-fraud).</li>
              <li>Memproses pembayaran dan top-up saldo melalui payment gateway.</li>
              <li>Mengirim notifikasi terkait aktivitas akun (order, pengiriman, saldo) melalui WhatsApp Business.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">3. Berbagi Data dengan Pihak Ketiga</h2>
            <p>Kami membagikan data seperlunya kepada:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li><strong>Duitku</strong> — pemrosesan pembayaran dan top-up saldo.</li>
              <li><strong>Penyedia WhatsApp Business API</strong> — pengiriman notifikasi transaksional.</li>
            </ul>
            <p className="mt-1">Kami tidak menjual data pengguna kepada pihak ketiga untuk kepentingan iklan.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">4. Penyimpanan &amp; Keamanan Data</h2>
            <p>
              Data disimpan pada server yang kami kelola dengan koneksi terenkripsi (HTTPS/SSL). Akses ke data
              dibatasi berdasarkan peran (role) pengguna dalam sistem.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">5. Hak Pengguna</h2>
            <p>
              Pengguna dapat meminta akses, koreksi, atau penghapusan data pribadi dengan menghubungi admin
              organisasi tempat pengguna terdaftar, atau melalui kontak di bagian bawah halaman ini.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">6. Anak di Bawah Umur</h2>
            <p>
              Aplikasi ini ditujukan untuk penggunaan internal bisnis (karyawan/mitra usia kerja) dan tidak
              ditujukan untuk anak-anak di bawah 18 tahun.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">7. Perubahan Kebijakan</h2>
            <p>
              Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan signifikan akan diinformasikan melalui
              aplikasi.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">8. Kontak</h2>
            <p>
              Pertanyaan seputar privasi data dapat diarahkan ke:{" "}
              <a href="mailto:privacy@canvasdist.my.id" className="text-[var(--color-primary-1)]">
                privacy@canvasdist.my.id
              </a>
            </p>
          </section>

          <p className="text-xs text-[var(--color-ink-faint)] pt-2 border-t border-white/60">
            Catatan: dokumen ini adalah kerangka dasar kebijakan privasi. Sebelum dipublikasikan resmi ke Play
            Store/App Store, disarankan untuk direview oleh penasihat hukum agar sesuai dengan ketentuan
            perlindungan data yang berlaku (mis. UU PDP di Indonesia) dan kebutuhan bisnis spesifik kamu.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
