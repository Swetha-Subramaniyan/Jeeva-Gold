-- AlterTable
ALTER TABLE `bill` ADD COLUMN `hallmarkBalance` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `billitem` ADD COLUMN `goldRate` DOUBLE NULL;
