-- AlterTable
ALTER TABLE `Vendor` ADD COLUMN `deactivatedAt` DATETIME(3) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
