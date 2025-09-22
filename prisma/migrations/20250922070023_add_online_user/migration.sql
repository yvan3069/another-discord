/*
  Warnings:

  - A unique constraint covering the columns `[profileId,serverId]` on the table `OnlineUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OnlineUser_profileId_serverId_key" ON "OnlineUser"("profileId", "serverId");
