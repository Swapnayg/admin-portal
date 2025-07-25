/*
  Warnings:

  - A unique constraint covering the columns `[vendorId]` on the table `LocationZone` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vendorId` to the `LocationZone` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `LocationZone_name_key` ON `LocationZone`;

-- AlterTable
ALTER TABLE `LocationZone` ADD COLUMN `vendorId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `LocationZone_vendorId_key` ON `LocationZone`(`vendorId`);

-- AddForeignKey
ALTER TABLE `LocationZone` ADD CONSTRAINT `LocationZone_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
