-- CreateTable
CREATE TABLE `JewelStock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jewelName` VARCHAR(191) NOT NULL,
    `weight` DOUBLE NOT NULL,
    `stoneWeight` DOUBLE NOT NULL,
    `finalWeight` DOUBLE NOT NULL,
    `touch` DOUBLE NOT NULL,
    `purityValue` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
