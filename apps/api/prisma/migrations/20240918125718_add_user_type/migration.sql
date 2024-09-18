/*
  Warnings:

  - The values [ACTIVE,INACTIVE,BANNED] on the enum `User_Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `Status` ENUM('Orginizer', 'Customer') NOT NULL;
