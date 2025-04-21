/*
  Warnings:

  - You are about to drop the column `resumeName` on the `resume_files` table. All the data in the column will be lost.
  - Added the required column `resumeName` to the `resumes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "resume_files" DROP COLUMN "resumeName";

-- AlterTable
ALTER TABLE "resumes" ADD COLUMN     "resumeName" TEXT NOT NULL;
