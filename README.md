# 🚀 Petualang STEM — TK Sultan Agung

Website pembelajaran interaktif berbasis STEM untuk anak TK (4–6 tahun), dengan tiga dunia
literasi bertema, gamifikasi lengkap, dan dashboard untuk orang tua & admin. Seluruh instruksi
dibacakan dengan suara (Web Speech API bahasa Indonesia) karena anak TK belum lancar membaca.

## Fitur

### Untuk anak 🧒

| Dunia | Aktivitas |
|---|---|
| 🏠 **Rumah Kata** (Literasi Bahasa) | Huruf A–Z, Flashcard Kata, Dengar & Tebak (audio), Menyusun Kata, Puzzle Huruf, Quiz |
| 🚀 **Kota Angka** (Literasi Numerik) | Mengenal Angka (1–10 / 1–20), Menghitung, Penjumlahan, Pengurangan, Puzzle Angka, Quiz |
| 🌱 **Kebun Sains** (Literasi Sains) | Dunia Hewan, Tumbuhan Tumbuh, Cuaca, Tubuh Manusia, Planet & Langit, Eksperimen Tenggelam-Terapung, Puzzle Sains, Quiz |

- Aktivitas terbuka **berurutan** (jalur belajar) — node yang berdenyut adalah "giliranmu"
- Setiap aktivitas membawa **badge S·T·E·M** + penjelasan aspek yang dilatih
- **Game bebas**: membuat gelang manik-manik (eksplorasi pola tanpa benar-salah)
- Jawaban salah tidak pernah dihukum: satu kesempatan kedua yang lembut, lalu lanjut

### Gamifikasi 🏆
- **Avatar** (4 gratis + 4 dibuka dengan koin), **XP & Level** (7 gelar dari "Penjelajah Baru" sampai "Juara STEM"), **Koin**, **Bintang** (1–3 per aktivitas, hasil terbaik disimpan)
- **Lencana dunia** (Sahabat Kata, Jagoan Angka, Ilmuwan Cilik) + **9 pencapaian**
- **Papan Bintang** (leaderboard): hasil kuis di server digabung dengan progres anak di perangkat

### Untuk orang dewasa 👩‍🏫
- **Profil Anak** (`/profil`) — identitas, avatar, level, lencana, pencapaian
- **Perkembangan** (`/perkembangan`) — progres per dunia, grafik 14 hari, rekap aspek STEM, riwayat
- **Dashboard Orang Tua** (`/ortu`) — capaian + saran pendampingan tanpa layar di rumah
- **Dashboard Admin** (`/admin`) — inventori konten, pohon modul→aktivitas→soal
- **Panduan** (`/panduan`) — cara pakai untuk guru (mode klasikal/proyektor & individu) dan orang tua

## Tech Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · PostgreSQL + Prisma ORM · Zod

## Menjalankan

### Mode cepat (tanpa database) — default

```bash
npm install
npm run dev          # buka http://localhost:3000
```

Tanpa konfigurasi apa pun aplikasi memakai **konten demo in-memory** — semua fitur berjalan.
Hasil kuis/leaderboard di server bersifat sementara (hilang saat server restart); progres anak
tersimpan permanen di `localStorage` perangkat.

### Mode PostgreSQL (produksi)

```bash
docker compose up -d          # Postgres lokal (user/pass/db: stem/stem/stem_sultan_agung)
cp .env.example .env          # lalu set DATA_SOURCE=postgres
npm run prisma:migrate        # buat tabel
npm run prisma:seed           # isi soal kuis (dari sumber yang sama dengan mode demo)
npm run dev
```

### Skrip

| Skrip | Kegunaan |
|---|---|
| `npm run dev` / `build` / `start` | Dev server / build produksi / serve produksi |
| `npm run lint` / `typecheck` | ESLint / TypeScript check |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Terapkan migration |
| `npm run prisma:seed` | Seed soal kuis dari `services/infrastructure/data/demoContent.ts` |
| `npm run prisma:studio` | GUI database |

## Deploy

**Vercel (paling mudah):** import repo → deploy. Tanpa env var apa pun, mode demo langsung
jalan. Untuk data persisten: sediakan Postgres (Neon/Supabase/Vercel Postgres), set env
`DATABASE_URL` dan `DATA_SOURCE=postgres`, lalu jalankan `prisma migrate deploy` + seed.

**Server sendiri:** `npm run build && npm run start` di belakang reverse proxy. Security headers
(nosniff, frame deny, referrer-policy, permissions-policy) sudah dipasang di `next.config.ts`.

## Arsitektur — Clean Architecture

Dependency mengalir ke dalam: `app/` → use-cases → domain. Domain tidak mengenal Prisma/Next.

```
app/                        Presentation — pages & API routes (App Router)
components/
  ui/                        Komponen dasar reusable (Button, Card, OptionButton, DataTable, Robo…)
  layout/                    Navbar, Providers (MotionConfig reduce-motion)
  features/
    worlds/                  WorldDoor, WorldMap (jalur aktivitas berurutan)
    quiz/                    QuizRunner, ResultCelebration
    learning/                16 aktivitas belajar dari 5 ENGINE reusable:
      engines/                 ExplorerBoard · FlashcardDeck · PickAnswerGame
                               · SequenceBuilder · SinkFloatLab (+ intro/finish bersama)
      content/                 Data per literasi (bahasa.ts, numerik.ts, sains.ts)
      meta.ts                  Registry fitur + badge STEM + mapping slug kuis
    game/                    BeadGame (eksplorasi bebas)
    dashboard/               StatCard, WorldProgressBars, WeeklyChart, StemAspectBars, Leaderboard
hooks/                      useChildProfile (profil+progres+gamifikasi), useSpeech (TTS id-ID)
lib/                        container.ts (composition root), prisma.ts, apiClient.ts
services/
  domain/                   Entities murni + repository interfaces (tanpa framework)
  use-cases/                GetModulesByGrade, GetActivityDetail, CheckAnswer,
                            SubmitActivityResult, GetLeaderboard, …
  infrastructure/           Prisma repositories · In-memory repositories · demoContent
types/                      domain.ts, dto.ts, learning.ts
utils/                      cn, constants (tema dunia), gamification (aturan XP/level/badge)
prisma/                     schema.prisma, seed.ts (bersumber dari demoContent)
docs/                       desain-ui-wireframe.html (dokumen desain)
```

**Menukar sumber data = satu env var.** `lib/container.ts` memilih repository Prisma atau
in-memory; use-case dan UI tidak berubah sama sekali.

**Menambah aktivitas belajar baru** = 1 entri di `learning/meta.ts` + 1 konfigurasi konten +
1 case di `LearningActivity.tsx` (pakai engine yang ada). Menambah soal kuis = edit
`demoContent.ts` (otomatis dipakai mode demo *dan* seed database).

## Keamanan & Privasi

- Kunci jawaban kuis **tidak pernah dikirim ke browser** — penilaian per soal lewat
  `POST /api/answers/check`, skor akhir dihitung server (`Activity.score()`)
- Tidak ada akun/password anak; nama panggilan opsional, progres di `localStorage` perangkat
- Semua input API divalidasi dengan Zod; security headers dipasang global
- Catatan: soal *learning games* (bukan kuis) sengaja berada di client — konten edukasi statis,
  bukan rahasia

## Aksesibilitas

- Instruksi audio di semua layar anak (tombol 🔊 selalu tersedia)
- Target sentuh besar (min. 96 px untuk pilihan jawaban), font rounded ramah anak
- `MotionConfig reducedMotion="user"` — animasi mengikuti preferensi OS
- Focus ring terlihat untuk navigasi keyboard, `aria-label`/`aria-live` pada komponen interaktif
- Progres soal berupa "lampu" berwarna, bukan angka — terbaca tanpa kemampuan membaca

## Status & Langkah Berikutnya

- ✅ Lolos `typecheck`, `lint`, dan `next build` (17 route)
- Ide lanjutan (lihat `docs/desain-ui-wireframe.html`): Mode Mengajar proyektor dengan roda nama,
  Dashboard Guru dengan RPPH & asesmen BB/MB/BSH/BSB, rekaman suara guru menggantikan TTS,
  panel admin CRUD soal
