/*
  Warnings:

  - The primary key for the `IndexedEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `IndexedEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `transactionHash` to the `IndexedEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IndexedEvent" DROP CONSTRAINT "IndexedEvent_pkey",
ADD COLUMN     "transactionHash" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "IndexedEvent_pkey" PRIMARY KEY ("id");
