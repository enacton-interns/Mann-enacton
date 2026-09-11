import { db } from "@/db/drizzle";
import {
  productTable,
  purchaseOrderItems,
  purchaseOrders,
  salesOrderItems,
  salesOrders,
  supplierTable,
  usersTable,
} from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { unionAll } from "drizzle-orm/pg-core";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const [{
    productName,
    stock,
    minimumStock,
  }] = await db
    .select({
      productName: productTable.name,
      stock: productTable.stock,
      minimumStock: productTable.minimumStock,
    })
    .from(productTable)
    .where(eq(productTable.id, Number(productId)))
    .limit(1);

  const purchaseQuery = db
    .select({
      orderType: sql<string>`'purchase'`.as("orderType"),
      orderId: purchaseOrders.id.as("orderId"),
      orderDate: purchaseOrders.purchaseDate.as("orderDate"),
      orderTotal: purchaseOrders.totalAmount.as("orderTotal"),
      quantity: purchaseOrderItems.quantity.as("quantity"),
      unitPrice: purchaseOrderItems.purchasePrice.as("unitPrice"),
      itemTotal: purchaseOrderItems.totalAmount.as("itemTotal"),
      name: supplierTable.name.as("name"),
    })
    .from(purchaseOrders)
    .innerJoin(
      purchaseOrderItems,
      eq(purchaseOrders.id, purchaseOrderItems.purchaseOrderId),
    )
    .innerJoin(supplierTable, eq(purchaseOrders.supplierId, supplierTable.id))
    .where(eq(purchaseOrderItems.productId, Number(productId)));

  const salesQuery = db
    .select({
      orderType: sql<string>`'sales'`.as("orderType"),
      orderId: salesOrders.id.as("orderId"),
      orderDate: salesOrders.saleDate.as("orderDate"),
      orderTotal: salesOrders.totalAmount.as("orderTotal"),
      quantity: salesOrderItems.quantity.as("quantity"),
      unitPrice: salesOrderItems.sellingPrice.as("unitPrice"),
      itemTotal: salesOrderItems.totalAmount.as("itemTotal"),
      name: usersTable.name.as("name"),
    })
    .from(salesOrders)
    .innerJoin(
      salesOrderItems,
      eq(salesOrders.id, salesOrderItems.salesOrderId),
    )
    .innerJoin(usersTable, eq(salesOrders.userId, usersTable.id))
    .where(eq(salesOrderItems.productId, Number(productId)));

  const combinedOrders = await unionAll(purchaseQuery, salesQuery).orderBy(
    (t) => [desc(t.orderDate)],
  );

  const GrossRevenue = combinedOrders.reduce((acc, order) => {
    if (order.orderType === "sales") {
      return acc + order.itemTotal;
    }
    return acc;
  }, 0);

  const NetRevenue = combinedOrders.reduce((acc, order) => {
    if (order.orderType === "sales") {
      acc += order.itemTotal;
    } else {
      acc -= order.itemTotal;
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            #{productId}
          </p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {productName}
          </h1>
          <p className="text-md font-semibold text-slate-800 dark:text-slate-400 mt-1">
            Stock: <span className={`${stock < minimumStock ? "text-red-500 font-bold" : "text-green-500"}`}>{stock}</span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Net Revenue
          </p>
          <p className={`mt-2 text-3xl font-bold ${NetRevenue < 0 ? "text-red-500" : "text-emerald-600"}`}>
            ₹{NetRevenue.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Gross Revenue
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            ₹{GrossRevenue.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Transaction History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr className="text-left">
                <th className="px-6 py-3 text-sm font-semibold">Type</th>
                <th className="px-6 py-3 text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-sm font-semibold">
                  Supplier / User
                </th>
                <th className="px-6 py-3 text-sm font-semibold">Quantity</th>
                <th className="px-6 py-3 text-sm font-semibold">Unit Price</th>
                <th className="px-6 py-3 text-sm font-semibold">Total</th>
              </tr>
            </thead>

            <tbody>
              {combinedOrders.map((order) => (
                <tr
                  key={`${order.orderType}-${order.orderId}`}
                  className="border-t border-slate-200 dark:border-slate-800"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        order.orderType === "purchase"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {order.orderType === "purchase" ? "Purchase" : "Sale"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {order.name}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={
                        order.orderType === "purchase"
                          ? "text-emerald-600 font-semibold"
                          : "text-red-500 font-semibold"
                      }
                    >
                      {order.orderType === "purchase"
                        ? `+${order.quantity}`
                        : `-${order.quantity}`}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    ₹{order.unitPrice.toLocaleString()}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    ₹{order.itemTotal.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {combinedOrders.length === 0 && (
            <div className="py-16 text-center text-slate-500">
              No transactions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
