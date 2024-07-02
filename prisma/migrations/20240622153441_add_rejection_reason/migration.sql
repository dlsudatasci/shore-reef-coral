/*
  Warnings:

  - You are about to drop the column `rejectionReason` on the `team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `team` DROP COLUMN `rejectionReason`;

-- CreateTable
CREATE TABLE `RejectionReason` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reason` VARCHAR(480) NOT NULL,
    `teamId` INTEGER NOT NULL,

    UNIQUE INDEX `RejectionReason_teamId_key`(`teamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RejectionReason` ADD CONSTRAINT `RejectionReason_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
