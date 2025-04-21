/*
  Warnings:

  - You are about to drop the column `phonenumber` on the `goldsmith` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `goldsmith` DROP COLUMN `phonenumber`,
    ADD COLUMN `phone` VARCHAR(191) NULL;
