/*
  Warnings:

  - Added the required column `message` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_userId_fkey`;

-- DropIndex
DROP INDEX `Message_userId_fkey` ON `Message`;

-- AlterTable
ALTER TABLE `Message` ADD COLUMN `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Ticket` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `message` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `type` ENUM('GENERAL', 'TECHNICAL_ISSUE', 'DOCUMENTS', 'ACCOUNT_CLEARANCE', 'REACTIVATE_ACCOUNT', 'REFUND_REQUEST', 'ORDER_NOT_RECEIVED', 'RETURN_ISSUE', 'PAYMENT_ISSUE', 'PRODUCT_LISTING_ISSUE', 'INVENTORY_UPDATE_ISSUE', 'SHIPPING_ISSUE', 'SUPPORT') NOT NULL DEFAULT 'GENERAL',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
