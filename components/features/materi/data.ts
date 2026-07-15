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
// Folder sumber: https://drive.google.com/drive/folders/1jXbvDl86iakp5Yu02ngq8f1016SsDhhF
export const VIDEO_MATERI: MateriItem[] = [
  {
    title: "Pengantar Pengenalan Problem Solving",
    description:
      "Bekal untuk guru/pendamping sebelum mengenalkan pemecahan masalah (problem solving) kepada anak.",
    driveUrl: "https://drive.google.com/file/d/1l8CkE2DhrgGaJ74aJZmmbSNYSewthMWF/view",
  },
];

/** Modul & lembar kerja (PDF) — pratinjau + tombol unduh. */
// Folder sumber: https://drive.google.com/drive/folders/1omS8c3V8H1HwQ2iAhf0rqPMtIIDmpisz
export const LEMBAR_KERJA: MateriItem[] = [
  {
    title: "Modul CT & STEM — TK A (2026)",
    description: "Modul Computational Thinking & STEM untuk jenjang TK A.",
    driveUrl: "https://drive.google.com/file/d/16F-S0jgml36JqRllwQpTUlKBLhwaDUkT/view",
  },
  {
    title: "Modul CT & STEM — TK B (2026)",
    description: "Modul Computational Thinking & STEM untuk jenjang TK B.",
    driveUrl: "https://drive.google.com/file/d/138OIjMU-DqU02xGs8lTrl2pFvl6x2EkN/view",
  },
];

/**
 * ATAU: satu link folder Drive — seluruh isi folder tampil otomatis sebagai
 * galeri. Aktifkan bila nanti berkas bertambah banyak, agar tidak perlu
 * mendaftar satu per satu:
 * export const FOLDER_LEMBAR_KERJA =
 *   "https://drive.google.com/drive/folders/1omS8c3V8H1HwQ2iAhf0rqPMtIIDmpisz";
 */
export const FOLDER_LEMBAR_KERJA: string | null = null;

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
