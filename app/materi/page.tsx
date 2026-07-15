import { BackButton } from "@/components/ui/BackButton";
import {
  VIDEO_MATERI,
  LEMBAR_KERJA,
  FOLDER_LEMBAR_KERJA,
  drivePreviewUrl,
  driveDownloadUrl,
  driveFolderEmbedUrl,
} from "@/components/features/materi/data";

export const metadata = { title: "Materi Guru — Petualang STEM" };

/**
 * Materi Guru & Pendamping: video pembelajaran dan lembar kerja yang
 * di-hosting di Google Drive, ditayangkan langsung di dalam halaman.
 * Sumber datanya components/features/materi/data.ts.
 */
export default function MateriPage() {
  const folderEmbed = FOLDER_LEMBAR_KERJA ? driveFolderEmbedUrl(FOLDER_LEMBAR_KERJA) : null;
  const isEmpty = VIDEO_MATERI.length === 0 && LEMBAR_KERJA.length === 0 && !folderEmbed;

  return (
    <div className="min-h-full bg-lilacsoft/40">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <BackButton href="/" label="Beranda" />

        <h1 className="mt-6 text-3xl font-extrabold text-ink">📚 Materi Guru & Pendamping</h1>
        <p className="mt-1 max-w-[65ch] text-inksoft">
          Video pembelajaran dan lembar kerja pendukung untuk guru serta orang tua. Materi ini
          melengkapi aktivitas di aplikasi — tonton videonya sebelum mendampingi, cetak lembar
          kerjanya untuk kegiatan tanpa layar.
        </p>

        {isEmpty && (
          <div className="mt-8 rounded-2xl bg-sunsoft p-6">
            <p className="font-extrabold text-sundeep">Materi belum ditautkan</p>
            <p className="mt-2 max-w-[65ch] text-sm text-ink">
              Tambahkan link Google Drive (video atau folder lembar kerja) di file{" "}
              <code className="rounded bg-white/70 px-1.5 py-0.5 text-xs">
                components/features/materi/data.ts
              </code>{" "}
              — pastikan akses file di Drive diatur ke &ldquo;Siapa saja yang memiliki link&rdquo;.
            </p>
          </div>
        )}

        {VIDEO_MATERI.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-extrabold text-ink">🎬 Video Pembelajaran</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {VIDEO_MATERI.map((video) => {
                const src = drivePreviewUrl(video.driveUrl);
                if (!src) return null;
                return (
                  <div key={video.driveUrl} className="overflow-hidden rounded-2xl bg-white shadow-md shadow-ink/5">
                    <div className="aspect-video">
                      <iframe
                        src={src}
                        title={video.title}
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        className="h-full w-full border-0"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-extrabold text-ink">{video.title}</p>
                      {video.description && <p className="mt-1 text-sm text-inksoft">{video.description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {(LEMBAR_KERJA.length > 0 || folderEmbed) && (
          <section className="mt-10">
            <h2 className="text-xl font-extrabold text-ink">🖨️ Modul & Lembar Kerja</h2>
            <p className="mt-1 max-w-[65ch] text-sm text-inksoft">
              Unduh dan cetak untuk kegiatan di kelas atau di rumah.
            </p>

            {LEMBAR_KERJA.length > 0 && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {LEMBAR_KERJA.map((sheet) => {
                  const preview = drivePreviewUrl(sheet.driveUrl);
                  const download = driveDownloadUrl(sheet.driveUrl);
                  return (
                    <div key={sheet.driveUrl} className="rounded-2xl bg-white p-5 shadow-md shadow-ink/5">
                      <p className="font-extrabold text-ink">📄 {sheet.title}</p>
                      {sheet.description && <p className="mt-1 text-sm text-inksoft">{sheet.description}</p>}
                      <div className="mt-3 flex gap-2">
                        {preview && (
                          <a
                            href={preview}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-lilacsoft px-4 py-2 text-xs font-bold text-lilacdeep hover:bg-lilac"
                          >
                            👁 Lihat
                          </a>
                        )}
                        {download && (
                          <a
                            href={download}
                            className="rounded-full bg-mintsoft px-4 py-2 text-xs font-bold text-mintdeep hover:bg-mint"
                          >
                            ⬇️ Unduh & Cetak
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {folderEmbed && (
              <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-md shadow-ink/5">
                <iframe
                  src={folderEmbed}
                  title="Folder lembar kerja"
                  className="h-96 w-full border-0"
                />
              </div>
            )}
          </section>
        )}

        <p className="mt-10 text-xs text-inksoft">
          Materi ditayangkan langsung dari Google Drive sekolah — memperbarui file di Drive otomatis
          memperbarui tampilannya di sini.
        </p>
      </div>
    </div>
  );
}
