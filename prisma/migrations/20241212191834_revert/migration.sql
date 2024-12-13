/*
  Warnings:

  - The primary key for the `Subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Subject` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Work` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Work` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "course"."Course" DROP CONSTRAINT "Course_priceId_fkey";

-- AlterTable
ALTER TABLE "course"."Subject" DROP CONSTRAINT "Subject_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Subject_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "course"."Work" DROP CONSTRAINT "Work_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Work_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "course"."Course" ADD CONSTRAINT "Course_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "course"."Price"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
