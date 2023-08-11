-- AlterTable
ALTER TABLE "albums" ADD COLUMN     "inFavorites" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "artists" ADD COLUMN     "inFavorites" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "tracks" ADD COLUMN     "inFavorites" BOOLEAN NOT NULL DEFAULT false;
