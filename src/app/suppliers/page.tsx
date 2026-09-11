import { db } from "@/db/drizzle"
import { supplierTable } from "@/db/schema"
import { Supplier } from "@/types/Supplier";
import SupplierClient from "./components/SupplierClient";
import { desc } from "drizzle-orm";

export default async function SupplierPage() {
  const suppliers: Supplier[] = await db.select().from(supplierTable).orderBy(desc(supplierTable.id));
  return <SupplierClient suppliers={suppliers} />;
}