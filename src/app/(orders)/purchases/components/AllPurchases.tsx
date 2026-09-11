"use client";

import { ShoppingBasket } from "lucide-react";
import { GetPurchaseOrderWithSupplierAndProduct } from "@/types/Purchase";

type GroupedPurchase = {
  purchase_orders: GetPurchaseOrderWithSupplierAndProduct["purchase_orders"];
  suppliers: GetPurchaseOrderWithSupplierAndProduct["suppliers"];
  items: {
    purchase_order_items: GetPurchaseOrderWithSupplierAndProduct["purchase_order_items"];
    products: GetPurchaseOrderWithSupplierAndProduct["products"];
  }[];
};

type Props = {
  allPurchases: GroupedPurchase[];
};

export default function AllPurchases({ allPurchases }: Props) {
  if (allPurchases.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400">
        <div className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700">
          <ShoppingBasket size={28} absoluteStrokeWidth />
        </div>
        No purchase orders found. Create your first order to get started.
      </div>
    );
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="flex flex-col gap-3 md:hidden">
        {allPurchases.map((purchase) => (
          <div
            key={purchase.purchase_orders?.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-900 dark:text-white">
                  #{purchase.purchase_orders?.id}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {purchase.purchase_orders?.purchaseDate}
                </span>
              </div>
              <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">
                ₹{Number(purchase.purchase_orders?.totalAmount ?? 0).toFixed(2)}
              </span>
            </div>

            {/* Supplier */}
            <div className="mb-3">
              <span className="inline-flex rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 text-xs font-medium">
                {purchase.suppliers?.name}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {purchase.items.map((item) => (
                <div
                  key={item.purchase_order_items.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate mr-2">
                    {item.products?.name}
                  </span>
                  <div className="flex items-center gap-3 shrink-0 text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>×{item.purchase_order_items.quantity}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ₹{Number(item.purchase_order_items.purchasePrice ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Order ID
                </th>

                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date
                </th>

                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Supplier
                </th>

                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Product
                </th>

                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Unit Price
                </th>

                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Qty
                </th>

                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Line Total
                </th>

                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Order Total
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {allPurchases.map((purchase) =>
                purchase.items.map((item, index) => (
                  <tr
                    key={item.purchase_order_items.id}
                    className={`dark:hover:bg-slate-800/40 ${index === 0 && "border-t-8 border-slate-100 dark:border-slate-950"}`}
                  >
                    {index === 0 && (
                      <>
                        <td
                          rowSpan={purchase.items.length}
                          className="px-5 py-4 align-middle font-medium text-slate-900 dark:text-white"
                        >
                          <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 font-semibold">
                            #{purchase.purchase_orders?.id}
                          </span>
                        </td>

                        <td
                          rowSpan={purchase.items.length}
                          className="px-5 py-4 align-middle font-medium text-slate-700 dark:text-slate-300"
                        >
                          {purchase.purchase_orders?.purchaseDate}
                        </td>

                        <td
                          rowSpan={purchase.items.length}
                          className="px-5 py-4 align-middle font-medium text-slate-700 dark:text-slate-300"
                        >
                          <span className="inline-flex rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-xs font-medium">
                            {purchase.suppliers?.name}
                          </span>
                        </td>
                      </>
                    )}

                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                      {item.products?.name}
                    </td>

                    <td className="px-5 py-4 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      ₹
                      {Number(
                        item.purchase_order_items.purchasePrice ?? 0,
                      ).toFixed(2)}
                    </td>

                    <td className="px-5 py-4 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      {item.purchase_order_items.quantity}
                    </td>

                    <td className="px-5 py-4 text-right tabular-nums font-medium text-slate-900 dark:text-white">
                      ₹
                      {Number(item.purchase_order_items.totalAmount ?? 0).toFixed(
                        2,
                      )}
                    </td>

                    {index === 0 && (
                      <td
                        rowSpan={purchase.items.length}
                        className="px-5 py-4 align-middle font-medium text-right tabular-nums text-slate-900 dark:text-white"
                      >
                        ₹
                        {Number(
                          purchase.purchase_orders?.totalAmount ?? 0,
                        ).toFixed(2)}
                      </td>
                    )}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
