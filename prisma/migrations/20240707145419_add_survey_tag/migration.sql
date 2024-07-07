/*
  Warnings:

  - Added the required column `tag` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `survey` ADD COLUMN `tag` VARCHAR(191) NOT NULL;
