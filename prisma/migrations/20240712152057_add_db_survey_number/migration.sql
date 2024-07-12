/*
  Warnings:

  - Added the required column `dbSurveyNum` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `survey` ADD COLUMN `dbSurveyNum` VARCHAR(191) NOT NULL;
