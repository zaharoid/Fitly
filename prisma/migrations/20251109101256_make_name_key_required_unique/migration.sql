/*
  Warnings:

  - Made the column `nameKey` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "brand" TEXT,
    "servingQty" REAL NOT NULL DEFAULT 100,
    "kcal" REAL NOT NULL,
    "protein" REAL NOT NULL DEFAULT 0,
    "carbs" REAL NOT NULL DEFAULT 0,
    "fat" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT
);
INSERT INTO "new_Product" ("brand", "carbs", "createdAt", "fat", "id", "imageUrl", "kcal", "name", "nameKey", "protein", "servingQty") SELECT "brand", "carbs", "createdAt", "fat", "id", "imageUrl", "kcal", "name", "nameKey", "protein", "servingQty" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_nameKey_key" ON "Product"("nameKey");
CREATE INDEX "Product_name_idx" ON "Product"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
