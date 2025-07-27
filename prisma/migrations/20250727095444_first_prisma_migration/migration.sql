-- AlterTable
ALTER TABLE `Order` ADD COLUMN `shiprocketLabelUrl` VARCHAR(191) NULL,
    ADD COLUMN `shiprocketManifestUrl` VARCHAR(191) NULL,
    ADD COLUMN `shiprocketOrderId` INTEGER NULL,
    ADD COLUMN `shiprocketShipmentId` INTEGER NULL;

-- AlterTable
ALTER TABLE `OrderTracking` ADD COLUMN `externalStatus` VARCHAR(191) NULL,
    ADD COLUMN `provider` VARCHAR(191) NULL;
