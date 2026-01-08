-- AlterTable
ALTER TABLE "articles" ADD COLUMN "isSubscriberOnly" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "articles_isSubscriberOnly_idx" ON "articles"("isSubscriberOnly");
