/*
  Warnings:

  - The values [ACCEPTED] on the enum `Team_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `team` MODIFY `status` ENUM('APPROVED', 'REJECTED', 'PENDING') NOT NULL DEFAULT 'PENDING';
