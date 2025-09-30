/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_productId_key" ON "public"."reviews"("userId", "productId");
