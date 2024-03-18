/*
  Warnings:

  - You are about to drop the column `varified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "varified",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
