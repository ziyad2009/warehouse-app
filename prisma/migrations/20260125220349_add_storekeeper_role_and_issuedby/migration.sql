-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'STOREKEEPER';

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "issuedById" TEXT;

-- CreateIndex
CREATE INDEX "Request_issuedById_idx" ON "Request"("issuedById");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
