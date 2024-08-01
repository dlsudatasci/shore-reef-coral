/*
  Warnings:

  - Added the required column `uploaderId` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `survey` ADD COLUMN `uploaderId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Survey` ADD CONSTRAINT `Survey_uploaderId_fkey` FOREIGN KEY (`uploaderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
