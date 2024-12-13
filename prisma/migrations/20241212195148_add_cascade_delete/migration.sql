-- DropForeignKey
ALTER TABLE "course"."Course" DROP CONSTRAINT "Course_priceId_fkey";

-- AddForeignKey
ALTER TABLE "course"."Course" ADD CONSTRAINT "Course_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "course"."Price"("id") ON DELETE CASCADE ON UPDATE CASCADE;
