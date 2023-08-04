/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `ManagementType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ManagementType_type_key` ON `ManagementType`(`type`);
