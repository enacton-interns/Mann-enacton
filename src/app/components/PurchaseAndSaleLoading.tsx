export default function SkeletonLoader(){
    return (
      <div className="py-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              <div className="h-8 w-48 rounded bg-slate-200 dark:bg-slate-700" />
            </h1>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {[
                    "Order ID",
                    "Date",
                    "Seller",
                    "Items",
                    "Total Amount",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap"
                    >
                      <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    {/* Order ID */}
                    <td className="px-5 py-4">
                      <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
                    </td>

                    {/* Seller */}
                    <td className="px-5 py-4">
                      <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                    </td>

                    {/* Items */}
                    <td className="px-5 py-4">
                      <div className="space-y-2">
                        <div className="h-3 w-40 rounded bg-slate-200 dark:bg-slate-700" />
                        <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4">
                      <div className="mx-auto h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <div className="mx-auto h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-700" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
}