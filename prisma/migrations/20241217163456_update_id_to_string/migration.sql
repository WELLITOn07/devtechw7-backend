/*
  Warnings:

  - You are about to drop the column `applicationId` on the `Advertisement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Advertisement" DROP CONSTRAINT "Advertisement_applicationId_fkey";

-- AlterTable
ALTER TABLE "public"."Advertisement" DROP COLUMN "applicationId";
