-- CreateTable
CREATE TABLE "project_quotes" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "answers" JSONB NOT NULL,
  "estimateMinUsd" INTEGER NOT NULL,
  "estimateMaxUsd" INTEGER NOT NULL,
  "responded" BOOLEAN NOT NULL DEFAULT false,
  "respondedAt" TIMESTAMP(3),
  "adminNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "project_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_quotes_createdAt_idx" ON "project_quotes"("createdAt");

-- CreateIndex
CREATE INDEX "project_quotes_responded_createdAt_idx" ON "project_quotes"("responded", "createdAt");

