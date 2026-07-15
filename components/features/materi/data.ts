/**
 * Materi Guru & Pendamping — sumber datanya file ini saja.
 *
 * CARA MENAMBAH MATERI:
 * 1. Di Google Drive, klik kanan file/folder → "Bagikan" → ubah akses jadi
 *    "Siapa saja yang memiliki link" (viewer), lalu salin link-nya.
 * 2. Tempel link tersebut di daftar di bawah (bentuk link apa pun diterima:
 *    .../file/d/ID/view, .../open?id=ID, atau link folder).
 */

export interface MateriItem {
  title: string;
  description?: string;
  driveUrl: string;
}

/** Video pembelajaran untuk guru/pendamping — diputar langsung di halaman. */
export const VIDEO_MATERI: MateriItem[] = [
  // Contoh — GANTI dengan link video Drive Anda:
  // {
  //   title: "Cara Mendampingi Anak Bermain Pola",
  //   description: "Panduan 5 menit untuk guru sebelum sesi Kota Angka.",
  //   driveUrl: "https://drive.google.com/file/d/XXXXXXXXXXXX/view?usp=sharing",
  // },
];

/** Lembar kerja individual (PDF) — pratinjau + tombol unduh. */
export const LEMBAR_KERJA: MateriItem[] = [
  // {
  //   title: "Lembar Kerja Pola Manik-Manik",
  //   driveUrl: "https://drive.google.com/file/d/XXXXXXXXXXXX/view?usp=sharing",
  // },
];

/**
 * ATAU: satu link folder Drive berisi semua lembar kerja — seluruh isi folder
 * tampil otomatis sebagai galeri (tidak perlu mendaftar satu per satu).
 */
export const FOLDER_LEMBAR_KERJA: string | null = null;
// contoh: "https://drive.google.com/drive/folders/XXXXXXXXXXXX?usp=sharing";

// ── Helper URL Google Drive ─────────────────────────────

/** Ekstrak file/folder ID dari berbagai bentuk link Drive. */
export function driveId(url: string): string | null {
  const patterns = [/\/file\/d\/([\w-]+)/, /\/folders\/([\w-]+)/, /[?&]id=([\w-]+)/];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

/** URL iframe untuk memutar video / pratinjau PDF di dalam halaman. */
export function drivePreviewUrl(url: string): string | null {
  const id = driveId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : null;
}

/** URL unduh langsung. */
export function driveDownloadUrl(url: string): string | null {
  const id = driveId(url);
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : null;
}

/** URL iframe galeri isi folder. */
export function driveFolderEmbedUrl(url: string): string | null {
  const id = driveId(url);
  return id ? `https://drive.google.com/embeddedfolderview?id=${id}#grid` : null;
}
