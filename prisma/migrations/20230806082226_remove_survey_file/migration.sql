/*
  Warnings:

  - You are about to drop the column `verified` on the `survey` table. All the data in the column will be lost.
  - You are about to drop the `surveyfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `SurveyFile` DROP FOREIGN KEY `SurveyFile_surveyId_fkey`;

-- AlterTable
ALTER TABLE `CoralAssessment` ADD COLUMN `volunteer5` VARCHAR(191) NULL,
    ADD COLUMN `volunteer6` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Survey` DROP COLUMN `verified`,
    ADD COLUMN `volunteer5` VARCHAR(191) NULL,
    ADD COLUMN `volunteer6` VARCHAR(191) NULL,
    MODIFY `additionalInfo` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE `SurveyFile`;
