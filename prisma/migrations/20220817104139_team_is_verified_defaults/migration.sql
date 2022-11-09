-- AlterTable
ALTER TABLE `team` MODIFY `affiliation` VARCHAR(191) NULL,
    MODIFY `isVerified` BOOLEAN NOT NULL DEFAULT false;
