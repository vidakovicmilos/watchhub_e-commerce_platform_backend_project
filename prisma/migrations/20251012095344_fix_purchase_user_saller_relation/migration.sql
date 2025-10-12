/*
  Warnings:

  - Added the required column `sallerId` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Purchase" DROP CONSTRAINT "Purchase_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Purchase" ADD COLUMN     "sallerId" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PAID';

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_sallerId_fkey" FOREIGN KEY ("sallerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
