-- CreateTable
CREATE TABLE `ManagementType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Survey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `stationName` VARCHAR(191) NOT NULL,
    `startLongtitude` DOUBLE NOT NULL,
    `startLatitue` DOUBLE NOT NULL,
    `secondLongtitude` DOUBLE NOT NULL,
    `secondLatitude` DOUBLE NOT NULL,
    `gpsDatum` VARCHAR(191) NOT NULL,
    `barangay` VARCHAR(191) NOT NULL,
    `town` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `additionalInfo` VARCHAR(191) NOT NULL,
    `managementTypeId` INTEGER NOT NULL,
    `teamId` INTEGER NOT NULL,
    `leaderId` INTEGER NOT NULL,
    `scientist` VARCHAR(191) NOT NULL,
    `volunteer1` VARCHAR(191) NOT NULL,
    `volunteer2` VARCHAR(191) NOT NULL,
    `volunteer3` VARCHAR(191) NOT NULL,
    `volunteer4` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `C30ImageSet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `surveyId` INTEGER NOT NULL,
    `imageCount` INTEGER NOT NULL,

    UNIQUE INDEX `C30ImageSet_surveyId_key`(`surveyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `C30Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageSetId` INTEGER NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoralAssessment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageSetId` INTEGER NOT NULL,
    `teamId` INTEGER NOT NULL,
    `leaderId` INTEGER NOT NULL,
    `scientist` VARCHAR(191) NOT NULL,
    `volunteer1` VARCHAR(191) NOT NULL,
    `volunteer2` VARCHAR(191) NOT NULL,
    `volunteer3` VARCHAR(191) NOT NULL,
    `volunteer4` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoralInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coralAssessmentId` INTEGER NOT NULL,
    `imageId` INTEGER NOT NULL,
    `point1` VARCHAR(191) NOT NULL,
    `point2` VARCHAR(191) NOT NULL,
    `point3` VARCHAR(191) NOT NULL,
    `point4` VARCHAR(191) NOT NULL,
    `point5` VARCHAR(191) NOT NULL,
    `point6` VARCHAR(191) NOT NULL,
    `point7` VARCHAR(191) NOT NULL,
    `point8` VARCHAR(191) NOT NULL,
    `point9` VARCHAR(191) NOT NULL,
    `point10` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveyFile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `surveyId` INTEGER NOT NULL,
    `excelFilePath` VARCHAR(191) NOT NULL,
    `cpceFilePath` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SurveyFile_surveyId_key`(`surveyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Survey` ADD CONSTRAINT `Survey_leaderId_fkey` FOREIGN KEY (`leaderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Survey` ADD CONSTRAINT `Survey_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Survey` ADD CONSTRAINT `Survey_managementTypeId_fkey` FOREIGN KEY (`managementTypeId`) REFERENCES `ManagementType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C30ImageSet` ADD CONSTRAINT `C30ImageSet_surveyId_fkey` FOREIGN KEY (`surveyId`) REFERENCES `Survey`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C30Image` ADD CONSTRAINT `C30Image_imageSetId_fkey` FOREIGN KEY (`imageSetId`) REFERENCES `C30ImageSet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoralAssessment` ADD CONSTRAINT `CoralAssessment_leaderId_fkey` FOREIGN KEY (`leaderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoralAssessment` ADD CONSTRAINT `CoralAssessment_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoralAssessment` ADD CONSTRAINT `CoralAssessment_imageSetId_fkey` FOREIGN KEY (`imageSetId`) REFERENCES `C30ImageSet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoralInfo` ADD CONSTRAINT `CoralInfo_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `C30Image`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoralInfo` ADD CONSTRAINT `CoralInfo_coralAssessmentId_fkey` FOREIGN KEY (`coralAssessmentId`) REFERENCES `CoralAssessment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyFile` ADD CONSTRAINT `SurveyFile_surveyId_fkey` FOREIGN KEY (`surveyId`) REFERENCES `Survey`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
