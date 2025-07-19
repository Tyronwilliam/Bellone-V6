/*
  Warnings:

  - You are about to drop the `BoardLabel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `ProjectLabel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `BoardLabel` DROP FOREIGN KEY `BoardLabel_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `BoardLabel` DROP FOREIGN KEY `BoardLabel_labelId_fkey`;

-- AlterTable
ALTER TABLE `ProjectLabel` ADD COLUMN `colorOverride` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `BoardLabel`;
