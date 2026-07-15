import { BackButton } from "@/components/ui/BackButton";

export const metadata = { title: "Panduan — Petualang STEM" };

export default function PanduanPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <BackButton href="/" label="Beranda" />

      <h1 className="mt-6 text-3xl font-extrabold text-ink">Panduan Guru & Orang Tua</h1>
      <div className="mt-6 space-y-4 text-ink">
        <p className="max-w-[65ch]">
          Petualang STEM dirancang untuk digunakan bersama pendampingan orang dewasa, karena anak usia
          TK belum lancar membaca. Semua instruksi dibacakan dengan suara, dan tidak ada data pribadi
          anak yang dikirim ke internet.
        </p>

        <h2 className="pt-2 text-xl font-extrabold">Langkah penggunaan</h2>
        <ol className="max-w-[65ch] list-decimal space-y-2 pl-6">
          <li>Pilih jenjang anak: TK A (4–5 tahun) atau TK B (5–6 tahun).</li>
          <li>Pilih salah satu dari tiga dunia: Rumah Kata (Bahasa), Kota Angka (Numerik), atau Kebun Sains.</li>
          <li>Aktivitas terbuka berurutan — mulai dari yang berdenyut, dengarkan instruksinya bersama anak.</li>
          <li>Biarkan anak menjawab sendiri dengan klik — bantu hanya jika diminta.</li>
          <li>Rayakan hasil bintang bersama anak, tanpa menekankan nilai/skor formal.</li>
        </ol>

        <h2 className="pt-2 text-xl font-extrabold">Untuk guru di kelas</h2>
        <ul className="max-w-[65ch] list-disc space-y-2 pl-6">
          <li>
            <b>Mode klasikal:</b> sambungkan laptop ke proyektor, buka menu <b>Quiz</b> untuk memilih
            aktivitas dengan cepat, dan gunakan tombol 🔊 untuk mengulang instruksi ke seluruh kelas.
          </li>
          <li>
            <b>Mode individu:</b> di lab komputer, minta anak mengisi nama di halaman <b>Profil</b> agar
            muncul di Papan Bintang, lalu biarkan mereka menjelajah dunianya sendiri.
          </li>
          <li>
            Badge <b>S · T · E · M</b> pada tiap aktivitas menunjukkan aspek yang dilatih — gunakan
            sebagai acuan saat menyusun RPPH.
          </li>
          <li>
            Pantau capaian lewat <b>Dashboard Orang Tua</b> (per perangkat) atau <b>Dashboard Admin</b>{" "}
            (inventori konten).
          </li>
        </ul>

        <h2 className="pt-2 text-xl font-extrabold">Prinsip yang kami pegang</h2>
        <ul className="max-w-[65ch] list-disc space-y-2 pl-6">
          <li>Jawaban salah tidak pernah dihukum — anak selalu mendapat kesempatan kedua yang lembut.</li>
          <li>Setiap penyelesaian dirayakan, berapa pun bintangnya.</li>
          <li>Sesi singkat lebih baik: 10–15 menit, lalu lanjutkan dengan kegiatan tanpa layar.</li>
        </ul>
      </div>
    </div>
  );
}
