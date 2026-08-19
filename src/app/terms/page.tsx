import { GlassCard } from "@/components/ui";

export const metadata = {
  title: "Syarat & Ketentuan — CanvasDist",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <GlassCard strong className="p-6 sm:p-8 space-y-5 text-sm text-[var(--color-ink)] leading-relaxed">
          <div>
            <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold mb-1">Syarat &amp; Ketentuan CanvasDist</h1>
            <p className="text-xs text-[var(--color-ink-soft)]">Terakhir diperbarui: 19 Agustus 2026</p>
          </div>

          <p>
            Dengan mengakses atau menggunakan aplikasi CanvasDist (web maupun mobile), pengguna dianggap
            menyetujui syarat dan ketentuan berikut.
          </p>

          <section>
            <h2 className="font-semibold text-base mb-2">1. Penggunaan Layanan</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>CanvasDist adalah platform internal untuk mengelola canvasing, distribusi, dan pengiriman produk.</li>
              <li>Akun pengguna dibuat dan dikelola oleh administrator organisasi terkait; pendaftaran mandiri tidak tersedia untuk publik.</li>
              <li>Pengguna wajib menjaga kerahasiaan email dan kata sandi akun masing-masing.</li>
              <li>Aktivitas yang dilakukan melalui akun pengguna menjadi tanggung jawab pemilik akun.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">2. Akurasi Data</h2>
            <p>
              Pengguna (Sales, Kurir, Agen, dan role lain) wajib memasukkan data yang akurat saat checkin
              kunjungan, membuat order, memproses pengiriman, dan mengunggah bukti (foto/lokasi). Data yang
              sengaja dipalsukan dapat mengakibatkan pembatasan atau penonaktifan akun.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">3. Saldo &amp; Pembayaran</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Top-up saldo diproses melalui payment gateway pihak ketiga (Duitku) sesuai metode pembayaran yang dipilih.</li>
              <li>Saldo yang sudah masuk ke akun bersifat non-refundable kecuali terjadi kesalahan sistem yang dapat diverifikasi.</li>
              <li>Komisi jaringan dan cashback dihitung otomatis oleh sistem berdasarkan aturan yang berlaku dan dapat berubah sewaktu-waktu sesuai kebijakan organisasi.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">4. Izin Aplikasi (Mobile)</h2>
            <p>Aplikasi mobile CanvasDist meminta izin berikut untuk fungsi tertentu:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li><strong>Lokasi</strong> — untuk checkin kunjungan dan tracking pengiriman. Hanya diakses saat fitur terkait digunakan.</li>
              <li><strong>Kamera</strong> — untuk mengambil foto checkin, bukti terima (POD), dan verifikasi barang.</li>
            </ul>
            <p className="mt-1">Pengguna dapat menolak izin ini, namun fitur terkait tidak akan berfungsi.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">5. Batasan Tanggung Jawab</h2>
            <p>
              Layanan disediakan &quot;sebagaimana adanya&quot;. Kami berupaya menjaga ketersediaan dan akurasi
              sistem, namun tidak bertanggung jawab atas kerugian yang timbul akibat gangguan teknis, kesalahan
              input pengguna, atau force majeure di luar kendali kami.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">6. Perubahan Layanan</h2>
            <p>
              Fitur, tampilan, dan kebijakan dalam aplikasi dapat berubah sewaktu-waktu untuk peningkatan
              layanan. Perubahan signifikan akan diinformasikan kepada pengguna.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">7. Kontak</h2>
            <p>
              Pertanyaan seputar syarat dan ketentuan dapat diarahkan ke:{" "}
              <a href="mailto:support@canvasdist.my.id" className="text-[var(--color-primary-1)]">
                support@canvasdist.my.id
              </a>
            </p>
          </section>

          <p className="text-xs text-[var(--color-ink-faint)] pt-2 border-t border-white/60">
            Catatan: dokumen ini adalah kerangka dasar syarat &amp; ketentuan. Sebelum dipublikasikan resmi,
            disarankan direview oleh penasihat hukum agar sesuai kebutuhan bisnis dan regulasi yang berlaku.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
