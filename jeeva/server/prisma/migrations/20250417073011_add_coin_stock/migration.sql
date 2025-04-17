/*
  Warnings:

  - You are about to drop the `stock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `stock`;

-- CreateTable
CREATE TABLE `CoinStock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coinType` VARCHAR(191) NOT NULL,
    `gram` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `touch` DOUBLE NOT NULL,
    `totalWeight` DOUBLE NOT NULL,
    `purity` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
