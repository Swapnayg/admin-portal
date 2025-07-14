/*
  Warnings:

  - You are about to drop the column `price` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `discount` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `shippingCharge` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `shippingTax` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `subTotal` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `taxTotal` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `total` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `OrderItem` DROP COLUMN `price`,
    ADD COLUMN `basePrice` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `taxAmount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `taxRate` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `total` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `commissionAmt` DOUBLE NULL DEFAULT 0,
    MODIFY `commissionPct` DOUBLE NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `basePrice` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `taxRate` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `price` DOUBLE NOT NULL DEFAULT 0;
