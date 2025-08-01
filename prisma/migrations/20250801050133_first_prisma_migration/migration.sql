/*
  Warnings:

  - You are about to drop the column `vendorId` on the `LocationZone` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `LocationZone` DROP FOREIGN KEY `LocationZone_vendorId_fkey`;

-- DropForeignKey
ALTER TABLE `Vendor` DROP FOREIGN KEY `Vendor_zoneId_fkey`;

-- DropIndex
DROP INDEX `LocationZone_vendorId_key` ON `LocationZone`;

-- DropIndex
DROP INDEX `Vendor_zoneId_fkey` ON `Vendor`;

-- AlterTable
ALTER TABLE `LocationZone` DROP COLUMN `vendorId`,
    MODIFY `country` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `VendorZone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vendorId` INTEGER NOT NULL,
    `zoneId` INTEGER NOT NULL,

    UNIQUE INDEX `VendorZone_vendorId_zoneId_key`(`vendorId`, `zoneId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VendorZone` ADD CONSTRAINT `VendorZone_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendorZone` ADD CONSTRAINT `VendorZone_zoneId_fkey` FOREIGN KEY (`zoneId`) REFERENCES `LocationZone`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
