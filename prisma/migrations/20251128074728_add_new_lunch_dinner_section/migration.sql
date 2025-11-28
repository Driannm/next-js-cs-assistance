/*
  Warnings:

  - A unique constraint covering the columns `[customerId,date,session]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Order_customerId_date_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "session" TEXT NOT NULL DEFAULT 'LUNCH';

-- CreateIndex
CREATE UNIQUE INDEX "Order_customerId_date_session_key" ON "Order"("customerId", "date", "session");
