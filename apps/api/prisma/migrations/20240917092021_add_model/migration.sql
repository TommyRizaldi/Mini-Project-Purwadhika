/*
  Warnings:

  - The values [SUSPENDED] on the enum `User_Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `Status` ENUM('ACTIVE', 'INACTIVE', 'BANNED') NOT NULL;

-- CreateTable
CREATE TABLE `Referral` (
    `ReferralId` VARCHAR(191) NOT NULL,
    `ReferralCode` VARCHAR(191) NOT NULL,
    `UserId` VARCHAR(191) NOT NULL,
    `CountUsed` INTEGER NOT NULL,
    `CreateDate` DATETIME(3) NOT NULL,
    `ExpireDate` DATETIME(3) NOT NULL,
    `Status` ENUM('ACTIVE', 'EXPIRED', 'USED') NOT NULL,

    PRIMARY KEY (`ReferralId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReferralUsed` (
    `ReferralUsedId` VARCHAR(191) NOT NULL,
    `ReferralCode` VARCHAR(191) NOT NULL,
    `UsedDate` DATETIME(3) NOT NULL,
    `UsedBy` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ReferralUsedId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PointsTrx` (
    `PointsId` VARCHAR(191) NOT NULL,
    `UserId` VARCHAR(191) NOT NULL,
    `ReferralCode` VARCHAR(191) NULL,
    `AddedDate` DATETIME(3) NOT NULL,
    `AddedBy` VARCHAR(191) NOT NULL,
    `ExpireDate` DATETIME(3) NOT NULL,
    `PointAmount` INTEGER NOT NULL,

    PRIMARY KEY (`PointsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Testimoni` (
    `TestimoniId` VARCHAR(191) NOT NULL,
    `Experience` ENUM('EXCELLENT', 'GOOD', 'AVERAGE', 'POOR') NOT NULL,
    `Quality` ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL,
    `Improvement` VARCHAR(191) NOT NULL,
    `Ratings` ENUM('FIVE_STAR', 'FOUR_STAR', 'THREE_STAR', 'TWO_STAR', 'ONE_STAR') NOT NULL,
    `CreateDate` DATETIME(3) NOT NULL,
    `UserId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`TestimoniId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `TransId` VARCHAR(191) NOT NULL,
    `UserId` VARCHAR(191) NOT NULL,
    `EventId` VARCHAR(191) NOT NULL,
    `SumTicket` INTEGER NOT NULL,
    `ReferralCode` VARCHAR(191) NULL,
    `PointsAmount` INTEGER NOT NULL,
    `TotalAmount` INTEGER NOT NULL,
    `CreateDate` DATETIME(3) NOT NULL,
    `ExpireDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`TransId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
