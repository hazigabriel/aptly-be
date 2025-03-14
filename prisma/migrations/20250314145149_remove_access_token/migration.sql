/*
  Warnings:

  - You are about to drop the column `accessToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "accessToken",
DROP COLUMN "isVerified",
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;
