/*
  Warnings:

  - You are about to alter the column `status` on the `usersonteams` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `UsersOnTeams` MODIFY `status` ENUM('ACCEPTED', 'REJECTED', 'PENDING', 'INACTIVE') NOT NULL DEFAULT 'PENDING';
