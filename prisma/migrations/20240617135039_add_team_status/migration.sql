-- AlterTable
ALTER TABLE `team` ADD COLUMN `rejectionReason` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('ACCEPTED', 'REJECTED', 'PENDING') NOT NULL DEFAULT 'PENDING';
