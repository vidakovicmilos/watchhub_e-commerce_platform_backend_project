/*
  Warnings:

  - You are about to drop the column `userId` on the `Purchase` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Purchase" DROP COLUMN "userId",
ADD COLUMN     "customerId" INTEGER NOT NULL;
