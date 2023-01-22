/*
  Warnings:

  - You are about to drop the column `startLatitue` on the `survey` table. All the data in the column will be lost.
  - Added the required column `dataType` to the `Survey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startLatitude` to the `Survey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Survey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verified` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `survey` DROP COLUMN `startLatitue`,
    ADD COLUMN `dataType` VARCHAR(191) NOT NULL,
    ADD COLUMN `startLatitude` DOUBLE NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `verified` BOOLEAN NOT NULL;

-- RenameIndex
ALTER TABLE `survey` RENAME INDEX `Survey_teamId_fkey` TO `Survey_teamId_idx`;
