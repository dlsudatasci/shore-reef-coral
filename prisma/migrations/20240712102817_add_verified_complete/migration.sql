/*
  Warnings:

  - You are about to drop the column `status` on the `survey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `survey` DROP COLUMN `status`,
    ADD COLUMN `isComplete` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false;
