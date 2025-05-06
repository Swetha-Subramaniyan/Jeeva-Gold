/*
  Warnings:

  - You are about to drop the column `originalGivenWeight` on the `item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `item` DROP COLUMN `originalGivenWeight`,
    ADD COLUMN `origit` DOUBLE NULL;

-- CreateTable
CREATE TABLE `StockLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coinType` VARCHAR(191) NOT NULL,
    `gram` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `changeType` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `coinStockId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StockLog` ADD CONSTRAINT `StockLog_coinStockId_fkey` FOREIGN KEY (`coinStockId`) REFERENCES `CoinStock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
