/*
  Warnings:

  - Added the required column `birthAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "birthAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;
