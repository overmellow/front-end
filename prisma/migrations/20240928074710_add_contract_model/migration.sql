/*
  Warnings:

  - You are about to drop the column `name` on the `Contract` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "name",
ADD COLUMN     "title" VARCHAR(255);
