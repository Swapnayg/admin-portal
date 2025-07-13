/*
  Warnings:

  - Added the required column `amountSpent` to the `PromotionUsage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `benefit` to the `PromotionUsage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commission` to the `PromotionUsage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PromotionUsage` ADD COLUMN `amountSpent` DOUBLE NOT NULL,
    ADD COLUMN `benefit` DOUBLE NOT NULL,
    ADD COLUMN `commission` DOUBLE NOT NULL,
    ADD COLUMN `orderId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `PromotionUsage` ADD CONSTRAINT `PromotionUsage_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
