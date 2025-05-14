/*
  Warnings:

  - Made the column `touch` on table `transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `purity` on table `transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `transaction` MODIFY `touch` DOUBLE NOT NULL,
    MODIFY `purity` DOUBLE NOT NULL;
