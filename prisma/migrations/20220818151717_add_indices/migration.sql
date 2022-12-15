-- AlterTable
ALTER TABLE `UsersOnTeams` MODIFY `isLeader` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `isScientist` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE INDEX `UsersOnTeams_isLeader_idx` ON `UsersOnTeams`(`isLeader`);

-- CreateIndex
CREATE INDEX `UsersOnTeams_status_idx` ON `UsersOnTeams`(`status`);
