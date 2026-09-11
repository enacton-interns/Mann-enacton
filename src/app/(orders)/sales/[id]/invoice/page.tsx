import { db } from "@/db/drizzle";
import InvoicePreview from "@/app/(orders)/sales/[id]/invoice/InvoicePreview";
import { desc, eq } from "drizzle-orm";
import { GroupedSales } from "@/types/Sales";
import { productTable, salesOrderItems, salesOrders, usersTable } from "@/db/schema";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sales = await db
    .select()
    .from(salesOrders)
    .innerJoin(
      salesOrderItems,
      eq(salesOrders.id, salesOrderItems.salesOrderId),
    )
    .leftJoin(usersTable, eq(salesOrders.userId, usersTable.id))
    .leftJoin(productTable, eq(salesOrderItems.productId, productTable.id))
    .where(eq(salesOrders.id, Number(id)))


    if (sales.length === 0) {
      return <div>Invoice not found</div>;
    }

    const sale = {
      sales_orders: sales[0].sales_orders,
      users: sales[0].users,
      items: sales.map((row) => ({
        sales_order_items: row.sales_order_items,
        products: row.products,
      })),
    };
    

  return (
    <main className="p-6">
      <InvoicePreview sale={sale} />
    </main>
  );
}
