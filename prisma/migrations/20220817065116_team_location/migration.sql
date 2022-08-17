/*
  Warnings:

  - Added the required column `affiliation` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barangay` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isVerified` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `town` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `team` ADD COLUMN `affiliation` VARCHAR(191) NOT NULL,
    ADD COLUMN `barangay` VARCHAR(191) NOT NULL,
    ADD COLUMN `isVerified` BOOLEAN NOT NULL,
    ADD COLUMN `province` VARCHAR(191) NOT NULL,
    ADD COLUMN `town` VARCHAR(191) NOT NULL;
