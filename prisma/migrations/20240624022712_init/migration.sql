-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" TEXT,
    "avatar" TEXT,
    "contactInfo" TEXT,
    "bio" TEXT,
    "registeredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountStatus" TEXT NOT NULL DEFAULT 'active',
    "e5SubscriptionDate" DATETIME,
    "e5ExpirationDate" DATETIME,
    "helpingUsers" TEXT NOT NULL DEFAULT '[]',
    "helpedUsers" TEXT NOT NULL DEFAULT '[]',
    "helpingByUsers" TEXT NOT NULL DEFAULT '[]',
    "helpedByUsers" TEXT NOT NULL DEFAULT '[]',
    "note" TEXT
);

-- CreateTable
CREATE TABLE "UserE5Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "posts" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "UserE5Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserNotification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "notifications" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "UserNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UsersE5SharedInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "sharedInfo" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "UsersE5SharedInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserE5Post_userId_key" ON "UserE5Post"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserNotification_userId_key" ON "UserNotification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UsersE5SharedInfo_userId_key" ON "UsersE5SharedInfo"("userId");
