/*
  Warnings:

  - You are about to drop the column `bio` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[yandexId]` on the table `artists` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[yandexId]` on the table `tracks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nickname]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "artists" ADD COLUMN     "yandexId" TEXT;

-- AlterTable
ALTER TABLE "tracks" ADD COLUMN     "yandexId" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "bio",
DROP COLUMN "isActive",
DROP COLUMN "role";

-- DropEnum
DROP TYPE "UserRole";

-- CreateIndex
CREATE UNIQUE INDEX "artists_yandexId_key" ON "artists"("yandexId");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_yandexId_key" ON "tracks"("yandexId");

-- CreateIndex
CREATE UNIQUE INDEX "users_nickname_key" ON "users"("nickname");
