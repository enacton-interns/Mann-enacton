import { db } from "@/db/drizzle";
import { productTable, supplierTable, categoryTable } from "@/db/schema";
import { asc, eq, desc } from "drizzle-orm";
import PurchasesComponent from "./components/PurchasesComponent";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { getPurchases } from "@/lib/purchases/getPurchases";

export default async function PurchasePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  let role = "STAFF";

  if (token) {
    try {
      const payload = await verifyToken(token);
      role = payload.role;
    } catch (e) {
      console.log(e);
    }
  }

  const purchasesData = await getPurchases({});

  const suppliers = await db
    .select()
    .from(supplierTable)
    .orderBy(asc(supplierTable.id));

  const products = await db
    .select()
    .from(productTable)
    .orderBy(asc(productTable.id));

  const categories = await db
    .select()
    .from(categoryTable)
    .orderBy(asc(categoryTable.id));

  return (
    <PurchasesComponent
      initialPurchases={purchasesData.purchases}
      nextCursor={purchasesData.nextCursor}
      hasMore={purchasesData.hasMore}
      suppliers={suppliers}
      products={products}
      categories={categories}
      role={role}
    />
  );
}
