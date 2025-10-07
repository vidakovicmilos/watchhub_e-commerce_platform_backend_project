-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "updatedAt" DROP NOT NULL;
