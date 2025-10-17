-- CreateTable
CREATE TABLE "public"."ResetCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResetCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResetCode_userId_code_key" ON "public"."ResetCode"("userId", "code");

-- AddForeignKey
ALTER TABLE "public"."ResetCode" ADD CONSTRAINT "ResetCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
