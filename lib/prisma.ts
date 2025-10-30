import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const FALLBACK_SUPABASE_URL =
  'postgresql://postgres:dragos1234dragos@db.dhkdtbflsmejpbjtcobg.supabase.co:5432/postgres';

const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.SUPABASE_DB_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  `${FALLBACK_SUPABASE_URL}?pgbouncer=true&sslmode=require`;

const directDatabaseUrl =
  process.env.DIRECT_URL ??
  process.env.SUPABASE_DIRECT_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  FALLBACK_SUPABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not set. Provide your Supabase Postgres connection string via DATABASE_URL (or SUPABASE_DB_URL/POSTGRES_PRISMA_URL) before running the app.'
  );
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: databaseUrl,
        directUrl: directDatabaseUrl
      }
    }
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
