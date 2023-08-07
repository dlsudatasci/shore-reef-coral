/*
  Warnings:

  - Added the required column `submissionType` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `survey` ADD COLUMN `submissionType` ENUM('CPCE', 'ALWAN', 'MANUAL') NOT NULL;
