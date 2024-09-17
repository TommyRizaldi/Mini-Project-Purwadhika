-- CreateTable
CREATE TABLE `User` (
    `UserId` VARCHAR(191) NOT NULL,
    `Username` VARCHAR(191) NOT NULL,
    `Name` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `CreateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `UpdateDate` DATETIME(3) NOT NULL,
    `Status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL,
    `ReferralCode` VARCHAR(191) NOT NULL,
    `SumPointAmount` INTEGER NOT NULL,
    `CountOfTransId` INTEGER NOT NULL,

    UNIQUE INDEX `User_Username_key`(`Username`),
    UNIQUE INDEX `User_Email_key`(`Email`),
    UNIQUE INDEX `User_ReferralCode_key`(`ReferralCode`),
    PRIMARY KEY (`UserId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
