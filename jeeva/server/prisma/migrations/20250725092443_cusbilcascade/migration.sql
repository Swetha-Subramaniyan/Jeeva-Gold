-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_customerId_fkey";

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
