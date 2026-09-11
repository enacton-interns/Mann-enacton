import { GroupedSales } from "@/types/Sales";
import { Eye, Package } from "lucide-react";
import Link from "next/link";

type Props = {
  allSales: GroupedSales[];
};

export default function AllSales({ allSales }: Props) {
  if (allSales.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400">
        <div className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700">
          <Package size={28} absoluteStrokeWidth />
        </div>
        No sales orders found. Create your first order to get started.
      </div>
    );
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="flex flex-col gap-3 md:hidden">
        {allSales.map((sale) => (
          <div
            key={sale.sales_orders?.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-900 dark:text-white">
                  #{sale.sales_orders?.id}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {sale.sales_orders?.saleDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">
                  ₹{Number(sale.sales_orders?.totalAmount ?? 0).toFixed(2)}
                </span>
                <Link
                  href={`/sales/${sale.sales_orders?.id}/invoice`}
                  className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                >
                  <Eye
                    size={14}
                    absoluteStrokeWidth
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </Link>
              </div>
            </div>

            {/* Seller */}
            <div className="mb-3">
              <span className="inline-flex rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 text-xs font-medium">
                {sale.users?.name}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {sale.items.map((item) => (
                <div
                  key={item.sales_order_items.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate mr-2">
                    {item.products?.name}
                  </span>
                  <div className="flex items-center gap-3 shrink-0 text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>×{item.sales_order_items.quantity}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ₹{Number(item.sales_order_items.sellingPrice ?? 0).toFixed(2)}
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
                  Seller
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

                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Invoice
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {allSales.map((sale) =>
                sale.items.map((item, index) => (
                  <tr
                    key={item.sales_order_items.id}
                    className={`dark:hover:bg-slate-800/40 ${
                      index === 0 &&
                      "border-t-8 border-slate-100 dark:border-slate-950"
                    }`}
                  >
                    {index === 0 && (
                      <>
                        <td
                          rowSpan={sale.items.length}
                          className="px-5 py-4 align-middle font-medium text-slate-900 dark:text-white"
                        >
                          <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 font-semibold">
                            #{sale.sales_orders?.id}
                          </span>
                        </td>

                        <td
                          rowSpan={sale.items.length}
                          className="px-5 py-4 align-middle font-medium text-slate-700 dark:text-slate-300"
                        >
                          {sale.sales_orders?.saleDate}
                        </td>

                        <td
                          rowSpan={sale.items.length}
                          className="px-5 py-4 align-middle font-medium text-slate-700 dark:text-slate-300"
                        >
                          <span className="inline-flex rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-xs font-medium">
                            {sale.users?.name}
                          </span>
                        </td>
                      </>
                    )}

                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                      {item.products?.name}
                    </td>

                    <td className="px-5 py-4 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      ₹
                      {Number(item.sales_order_items.sellingPrice ?? 0).toFixed(
                        2,
                      )}
                    </td>

                    <td className="px-5 py-4 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      {item.sales_order_items.quantity}
                    </td>

                    <td className="px-5 py-4 text-right tabular-nums font-medium text-slate-900 dark:text-white">
                      ₹
                      {Number(item.sales_order_items.totalAmount ?? 0).toFixed(2)}
                    </td>

                    {index === 0 && (
                      <>
                        <td
                          rowSpan={sale.items.length}
                          className="px-5 py-4 align-middle text-right font-medium tabular-nums text-slate-900 dark:text-white"
                        >
                          ₹
                          {Number(sale.sales_orders?.totalAmount ?? 0).toFixed(2)}
                        </td>

                        <td
                          rowSpan={sale.items.length}
                          className="px-5 py-4 align-middle text-center"
                        >
                          <Link
                            href={`/sales/${sale.sales_orders?.id}/invoice`}
                            className="inline-flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-indigo-500/10 dark:hover:bg-indigo-500/10"
                          >
                            <Eye
                              size={16}
                              absoluteStrokeWidth
                              className="text-indigo-600"
                            />
                          </Link>
                        </td>
                      </>
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
