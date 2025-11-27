/*
  Warnings:

  - You are about to drop the column `packageType` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `totalDays` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `packageId` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "packageType",
DROP COLUMN "totalDays",
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "packageId" TEXT NOT NULL,
ADD COLUMN     "preferences" TEXT;

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "composition" TEXT;

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "description" TEXT,
    "price" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
