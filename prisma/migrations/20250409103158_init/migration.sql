/*
  Warnings:

  - Added the required column `is_verified` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_verified" BOOLEAN NOT NULL,
ADD COLUMN     "last_login" TEXT,
ADD COLUMN     "otp" INTEGER,
ADD COLUMN     "password" TEXT NOT NULL;
