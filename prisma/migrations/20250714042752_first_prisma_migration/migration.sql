/*
  Warnings:

  - Added the required column `role` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ApiKey` ADD COLUMN `role` ENUM('ADMIN', 'VENDOR', 'CUSTOMER') NOT NULL;
