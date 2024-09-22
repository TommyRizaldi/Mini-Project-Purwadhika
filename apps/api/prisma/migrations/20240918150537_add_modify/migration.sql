/*
  Warnings:

  - You are about to drop the column `ExpireDate` on the `Referral` table. All the data in the column will be lost.
  - You are about to alter the column `Status` on the `Referral` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to drop the column `CreateDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `UpdateDate` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `Type` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.
  - You are about to alter the column `Status` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `VarChar(191)`.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `SumPointAmount` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `CountOfTransId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `PointsTrx` DROP FOREIGN KEY `PointsTrx_AddedBy_fkey`;

-- DropForeignKey
ALTER TABLE `ReferralUsed` DROP FOREIGN KEY `ReferralUsed_ReferralCode_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_UserId_fkey`;

-- DropIndex
DROP INDEX `Referral_ReferralCode_key` ON `Referral`;

-- DropIndex
DROP INDEX `User_ReferralCode_key` ON `User`;

-- DropIndex
DROP INDEX `User_Username_key` ON `User`;

-- AlterTable
ALTER TABLE `Referral` DROP COLUMN `ExpireDate`,
    MODIFY `Status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `CreateDate`,
    DROP COLUMN `UpdateDate`,
    MODIFY `ReferralCode` VARCHAR(191) NULL,
    MODIFY `SumPointAmount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `CountOfTransId` INTEGER NOT NULL DEFAULT 0,
    MODIFY `Type` VARCHAR(191) NOT NULL,
    MODIFY `Status` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Transaction`;
