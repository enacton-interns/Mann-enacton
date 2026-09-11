import { db } from "@/db/drizzle";
import {
  categoryTable,
  productTable,
  salesOrderItems,
  salesOrders,
  usersTable,
} from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import SalesComponent from "./components/SalesComponent";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { getSales } from "@/lib/sales/getSales";

export default async function Salespage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  let role = "STAFF";

  if (token) {
    try {
      const payload = await verifyToken(token);
      role = payload.role;
    } catch (e) {
      // Invalid or expired token
    }
  }

  const sales = await getSales({})

  const users = await db.select().from(usersTable).orderBy(asc(usersTable.id));

  const products = await db
    .select()
    .from(productTable)
    .orderBy(asc(productTable.id));

  const categories = await db
    .select()
    .from(categoryTable)
    .orderBy(asc(categoryTable.id));

  return (
    <SalesComponent
      role={role}
      initialSales={sales.sales}
      nextCursor={sales.nextCursor}
      hasMore={sales.hasMore}
      users={users}
      products={products}
      categories={categories}
    />
  );
}
