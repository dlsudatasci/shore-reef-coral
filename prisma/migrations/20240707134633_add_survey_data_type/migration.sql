/*
  Warnings:

  - You are about to alter the column `dataType` on the `survey` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `survey` MODIFY `dataType` ENUM('PRIVATE', 'PUBLIC') NOT NULL;
