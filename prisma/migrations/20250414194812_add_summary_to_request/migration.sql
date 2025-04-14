/*
  Warnings:

  - You are about to drop the column `aiTips` on the `Insight` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Insight` table. All the data in the column will be lost.
  - Added the required column `summary` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Insight" DROP COLUMN "aiTips",
DROP COLUMN "summary";

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "summary" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AITip" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "codeSnippet" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AITip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AITip" ADD CONSTRAINT "AITip_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
