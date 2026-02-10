-- CreateEnum
CREATE TYPE "ListType" AS ENUM ('NORMAL', 'FAVORITES');

-- AlterTable
ALTER TABLE "List" ADD COLUMN     "type" "ListType" NOT NULL DEFAULT 'NORMAL';
