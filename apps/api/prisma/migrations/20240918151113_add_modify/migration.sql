/*
  Warnings:

  - You are about to alter the column `Type` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `Status` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- DropIndex
DROP INDEX `PointsTrx_AddedBy_fkey` ON `PointsTrx`;

-- DropIndex
DROP INDEX `ReferralUsed_ReferralCode_fkey` ON `ReferralUsed`;

-- AlterTable
ALTER TABLE `User` MODIFY `Type` ENUM('Customer', 'Organizer') NOT NULL,
    MODIFY `Status` ENUM('Active', 'Inactive') NOT NULL;
