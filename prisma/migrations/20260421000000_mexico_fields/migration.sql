-- AlterTable User: add estado and colonia
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "estado" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "colonia" TEXT;
ALTER TABLE "User" ALTER COLUMN "country" SET DEFAULT 'México';

-- AlterTable TaskerProfile: add Mexico location fields and WhatsApp
ALTER TABLE "TaskerProfile" ADD COLUMN IF NOT EXISTS "estado" TEXT;
ALTER TABLE "TaskerProfile" ADD COLUMN IF NOT EXISTS "colonia" TEXT;
ALTER TABLE "TaskerProfile" ADD COLUMN IF NOT EXISTS "lat" DOUBLE PRECISION;
ALTER TABLE "TaskerProfile" ADD COLUMN IF NOT EXISTS "lng" DOUBLE PRECISION;
ALTER TABLE "TaskerProfile" ADD COLUMN IF NOT EXISTS "serviceRadiusKm" INTEGER NOT NULL DEFAULT 5;
ALTER TABLE "TaskerProfile" ADD COLUMN IF NOT EXISTS "whatsapp" TEXT;
