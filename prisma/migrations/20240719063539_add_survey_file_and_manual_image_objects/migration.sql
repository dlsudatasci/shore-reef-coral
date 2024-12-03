-- CreateTable
CREATE TABLE `SurveyFile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `surveyId` INTEGER NOT NULL,
    `excelFilePath` VARCHAR(191) NULL,
    `CPCEFilePath` VARCHAR(191) NULL,

    UNIQUE INDEX `SurveyFile_surveyId_key`(`surveyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveyGuideImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `surveyId` INTEGER NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coralDatasheetImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `surveyId` INTEGER NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SurveyFile` ADD CONSTRAINT `SurveyFile_surveyId_fkey` FOREIGN KEY (`surveyId`) REFERENCES `Survey`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyGuideImage` ADD CONSTRAINT `SurveyGuideImage_surveyId_fkey` FOREIGN KEY (`surveyId`) REFERENCES `Survey`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coralDatasheetImage` ADD CONSTRAINT `coralDatasheetImage_surveyId_fkey` FOREIGN KEY (`surveyId`) REFERENCES `Survey`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
