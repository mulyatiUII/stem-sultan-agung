import { PrismaClient } from "@prisma/client";

/**
 * Lazy singleton. Construction is deferred until first real use so that
 * demo mode (in-memory repositories) never touches Prisma or DATABASE_URL —
 * important on hosts (e.g. Vercel) where no database env vars are set.
 *
 * Caching on `globalThis` survives Next.js dev hot-reloads, which would
 * otherwise exhaust Postgres connections by re-instantiating the client.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
}
