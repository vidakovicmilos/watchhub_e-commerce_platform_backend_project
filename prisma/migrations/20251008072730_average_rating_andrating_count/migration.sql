-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "ratingCount" INTEGER DEFAULT 0,
ALTER COLUMN "averageRating" SET DEFAULT 0;
