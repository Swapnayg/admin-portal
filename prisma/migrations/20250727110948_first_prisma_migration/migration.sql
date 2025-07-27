-- DropIndex
DROP INDEX `ApiKey_key_key` ON `ApiKey`;

-- AlterTable
ALTER TABLE `ApiKey` MODIFY `key` TEXT NOT NULL;
