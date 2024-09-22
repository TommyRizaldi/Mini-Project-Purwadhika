-- CreateTable
CREATE TABLE `Event` (
    `EventId` VARCHAR(191) NOT NULL,
    `Name` VARCHAR(191) NOT NULL,
    `Price` DOUBLE NOT NULL,
    `TicketAvailability` INTEGER NOT NULL,
    `Date` DATETIME(3) NOT NULL,
    `Time` DATETIME(3) NOT NULL,
    `Location` VARCHAR(191) NOT NULL,
    `Description` VARCHAR(191) NOT NULL,
    `AvailableSeats` INTEGER NOT NULL,
    `Categories` ENUM('POP', 'JAZZ', 'ROCK', 'DANGDUT', 'EDM', 'FESTIVAL', 'OTHER') NOT NULL,
    `TicketTypes` ENUM('REGULAR', 'VIP') NOT NULL,
    `StartAt` DATETIME(3) NOT NULL,
    `EndAt` DATETIME(3) NOT NULL,
    `CreateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `CreateBy` VARCHAR(191) NOT NULL,
    `DiscountPrice` DOUBLE NULL,
    `DiscountStartDate` DATETIME(3) NULL,
    `DiscountEndDate` DATETIME(3) NULL,

    PRIMARY KEY (`EventId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EventTransactions` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_EventTransactions_AB_unique`(`A`, `B`),
    INDEX `_EventTransactions_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_EventId_fkey` FOREIGN KEY (`EventId`) REFERENCES `Event`(`EventId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventTransactions` ADD CONSTRAINT `_EventTransactions_A_fkey` FOREIGN KEY (`A`) REFERENCES `Event`(`EventId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventTransactions` ADD CONSTRAINT `_EventTransactions_B_fkey` FOREIGN KEY (`B`) REFERENCES `Transaction`(`TransId`) ON DELETE CASCADE ON UPDATE CASCADE;
