/*
  Warnings:

  - You are about to drop the column `awsFileKey` on the `resumes` table. All the data in the column will be lost.
  - You are about to drop the column `originalResumeName` on the `resumes` table. All the data in the column will be lost.
  - You are about to drop the column `resumeName` on the `resumes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "job_descriptions" ADD COLUMN     "resumeFileId" TEXT;

-- AlterTable
ALTER TABLE "resumes" DROP COLUMN "awsFileKey",
DROP COLUMN "originalResumeName",
DROP COLUMN "resumeName";

-- CreateTable
CREATE TABLE "resume_files" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "awsFileKey" TEXT,
    "resumeName" TEXT NOT NULL,
    "originalResumeName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "resume_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "resume_files_resumeId_key" ON "resume_files"("resumeId");

-- AddForeignKey
ALTER TABLE "resume_files" ADD CONSTRAINT "resume_files_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_files" ADD CONSTRAINT "resume_files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_descriptions" ADD CONSTRAINT "job_descriptions_resumeFileId_fkey" FOREIGN KEY ("resumeFileId") REFERENCES "resume_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
