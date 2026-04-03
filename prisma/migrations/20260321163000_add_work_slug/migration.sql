ALTER TABLE "works" ADD COLUMN "slug" TEXT;

UPDATE "works" SET "slug" = "id" WHERE "slug" IS NULL;

ALTER TABLE "works" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "works_slug_key" ON "works"("slug");
