-- CreateTable
CREATE TABLE `bffData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `surveyId` INTEGER NOT NULL,
    `bffType` VARCHAR(191) NOT NULL,
    `cs1` INTEGER NOT NULL,
    `cs2` INTEGER NOT NULL,
    `cs3` INTEGER NOT NULL,
    `cs4` INTEGER NOT NULL,
    `cs5` INTEGER NOT NULL,
    `cs6` INTEGER NOT NULL,
    `totalCount` INTEGER NOT NULL,
    `average` DOUBLE NOT NULL,
    `range` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tmiData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `surveyId` INTEGER NOT NULL,
    `tmiType` VARCHAR(191) NOT NULL,
    `tmiSubType` VARCHAR(191) NOT NULL,
    `cs1` INTEGER NOT NULL,
    `cs2` INTEGER NOT NULL,
    `cs3` INTEGER NOT NULL,
    `cs4` INTEGER NOT NULL,
    `cs5` INTEGER NOT NULL,
    `cs6` INTEGER NOT NULL,
    `totalCount` INTEGER NOT NULL,
    `average` DOUBLE NOT NULL,
    `range` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bffData` ADD CONSTRAINT `bffData_surveyId_fkey` FOREIGN KEY (`surveyId`) REFERENCES `Survey`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tmiData` ADD CONSTRAINT `tmiData_surveyId_fkey` FOREIGN KEY (`surveyId`) REFERENCES `Survey`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
