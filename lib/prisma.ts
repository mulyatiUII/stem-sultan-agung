import { PrismaClient } from "@prisma/client";

/**
 * Next.js reloads modules on every request in dev, which would otherwise
 * exhaust Postgres connections by re-instantiating PrismaClient each time.
 * Caching the instance on `globalThis` survives hot-reloads in dev only.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
