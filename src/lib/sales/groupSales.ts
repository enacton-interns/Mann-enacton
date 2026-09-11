import { GetSalesOrderWithProductAndUser, GroupedSales } from "@/types/Sales";

const groupSales = (initialSales: GetSalesOrderWithProductAndUser[]) => {
  const grouped = new Map<number, GroupedSales>();

  for (const row of initialSales) {
    const purchaseId = row.sales_orders.id;

    if (!grouped.has(purchaseId)) {
      grouped.set(purchaseId, {
        sales_orders: row.sales_orders,
        users: row.users,
        items: [],
      });
    }

    grouped.get(purchaseId)!.items.push({
      sales_order_items: row.sales_order_items,
      products: row.products,
    });
  }

  return [...grouped.values()];
};

export default groupSales