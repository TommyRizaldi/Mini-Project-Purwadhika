/*
  Warnings:

  - A unique constraint covering the columns `[AddedBy]` on the table `PointsTrx` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `PointsTrx_AddedBy_key` ON `PointsTrx`(`AddedBy`);

-- AddForeignKey
ALTER TABLE `PointsTrx` ADD CONSTRAINT `PointsTrx_AddedBy_fkey` FOREIGN KEY (`AddedBy`) REFERENCES `ReferralUsed`(`UsedBy`) ON DELETE RESTRICT ON UPDATE CASCADE;
