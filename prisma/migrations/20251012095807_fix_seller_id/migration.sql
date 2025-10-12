/*
  Warnings:

  - You are about to drop the column `sallerId` on the `Purchase` table. All the data in the column will be lost.
  - Added the required column `sellerId` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Purchase" DROP CONSTRAINT "Purchase_sallerId_fkey";

-- AlterTable
ALTER TABLE "public"."Purchase" DROP COLUMN "sallerId",
ADD COLUMN     "sellerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
