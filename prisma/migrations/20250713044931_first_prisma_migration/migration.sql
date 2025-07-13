/*
  Warnings:

  - Added the required column `status` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Promotion` ADD COLUMN `status` ENUM('ACTIVE', 'EXPIRED') NOT NULL,
    ADD COLUMN `type` ENUM('COUPON', 'CATEGORY', 'PRODUCT', 'USER_GROUP') NOT NULL;
