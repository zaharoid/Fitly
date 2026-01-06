/*
  Warnings:

  - You are about to drop the column `carbs` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `fat` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `kcal` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `protein` on the `Goal` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Goal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "weightCurrent" REAL,
    "weightTarget" REAL,
    "kcalTarget" REAL,
    "proteinTarget" REAL,
    "carbsTarget" REAL,
    "fatTarget" REAL,
    "activityLevel" TEXT,
    "deadline" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Goal" ("createdAt", "id", "updatedAt", "userId") SELECT "createdAt", "id", "updatedAt", "userId" FROM "Goal";
DROP TABLE "Goal";
ALTER TABLE "new_Goal" RENAME TO "Goal";
CREATE UNIQUE INDEX "Goal_userId_key" ON "Goal"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
