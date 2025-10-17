-- Migration: Add optional unique column "lid" to users (non-destructive)
-- This migration aligns the DB with schema.prisma (User.lid String? @unique)

ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "lid" TEXT;

-- Create unique index for lid if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_class c
    JOIN   pg_namespace n ON n.oid = c.relnamespace
    WHERE  c.relname = 'users_lid_key'
    AND    n.nspname = 'public'
  ) THEN
    CREATE UNIQUE INDEX "users_lid_key" ON "public"."users"("lid");
  END IF;
END$$;
