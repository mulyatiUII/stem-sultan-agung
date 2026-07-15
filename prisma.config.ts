import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * `prisma generate` (dijalankan postinstall, termasuk di build Vercel) tidak
 * pernah terhubung ke database — placeholder aman dipakai saat DATABASE_URL
 * tidak diset (mode demo in-memory). Perintah yang benar-benar butuh database
 * (migrate/seed/studio) tetap memakai DATABASE_URL asli dari environment.
 */
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  engine: "classic",
  datasource: {
    url: databaseUrl,
  },
});
