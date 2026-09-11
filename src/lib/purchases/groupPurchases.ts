import { GetPurchaseOrderWithSupplierAndProduct, GroupedPurchase } from "@/types/Purchase";

const groupPurchases = (initialPurchases: GetPurchaseOrderWithSupplierAndProduct[]) => {
    const grouped = new Map<number, GroupedPurchase>();

    for (const row of initialPurchases) {
      const purchaseId = row.purchase_orders.id;

      if (!grouped.has(purchaseId)) {
        grouped.set(purchaseId, {
          purchase_orders: row.purchase_orders,
          suppliers: row.suppliers,
          items: [],
        });
      }

      grouped.get(purchaseId)!.items.push({
        purchase_order_items: row.purchase_order_items,
        products: row.products,
      });
    }

    return [...grouped.values()];
}

export default groupPurchases