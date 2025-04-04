/*
  Warnings:

  - Added the required column `originalResumeName` to the `resumes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "cover_letters_jobDescriptionId_key";

-- DropIndex
DROP INDEX "enhanced_resumes_jobDescriptionId_key";

-- AlterTable
ALTER TABLE "resumes" ADD COLUMN     "originalResumeName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "passwordResetToken" TEXT;
