-- AlterTable
ALTER TABLE `Team` MODIFY `affiliation` VARCHAR(191) NULL,
    MODIFY `isVerified` BOOLEAN NOT NULL DEFAULT false;
