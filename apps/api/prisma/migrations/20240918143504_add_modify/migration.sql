/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Testimoni` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EventTransactions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ReferralCode]` on the table `Referral` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[UsedBy]` on the table `ReferralUsed` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Testimoni` DROP FOREIGN KEY `Testimoni_UserId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_EventId_fkey`;

-- DropForeignKey
ALTER TABLE `_EventTransactions` DROP FOREIGN KEY `_EventTransactions_A_fkey`;

-- DropForeignKey
ALTER TABLE `_EventTransactions` DROP FOREIGN KEY `_EventTransactions_B_fkey`;

-- AlterTable
ALTER TABLE `PointsTrx` MODIFY `AddedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Referral` MODIFY `CountUsed` INTEGER NOT NULL DEFAULT 0,
    MODIFY `CreateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `ReferralUsed` MODIFY `UsedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `Event`;

-- DropTable
DROP TABLE `Testimoni`;

-- DropTable
DROP TABLE `_EventTransactions`;

-- CreateIndex
CREATE UNIQUE INDEX `Referral_ReferralCode_key` ON `Referral`(`ReferralCode`);

-- CreateIndex
CREATE UNIQUE INDEX `ReferralUsed_UsedBy_key` ON `ReferralUsed`(`UsedBy`);

-- AddForeignKey
ALTER TABLE `ReferralUsed` ADD CONSTRAINT `ReferralUsed_ReferralCode_fkey` FOREIGN KEY (`ReferralCode`) REFERENCES `Referral`(`ReferralCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PointsTrx` ADD CONSTRAINT `PointsTrx_AddedBy_fkey` FOREIGN KEY (`AddedBy`) REFERENCES `ReferralUsed`(`UsedBy`) ON DELETE RESTRICT ON UPDATE CASCADE;
