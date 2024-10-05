/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "apps" TEXT[],
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'COMMON',
ALTER COLUMN "name" SET NOT NULL;
