export default function ProductsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="h-9 w-44 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-4 w-64 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                {[
                  "ID",
                  "Name",
                  "Description",
                  "Purchase Price",
                  "Selling Price",
                  "Stock",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {Array.from({ length: 8 }).map((_, index) => (
                <tr key={index}>
                  {/* ID */}
                  <td className="px-5 py-4">
                    <div className="h-4 w-10 rounded bg-slate-200 dark:bg-slate-700" />
                  </td>

                  {/* Name */}
                  <td className="px-5 py-4">
                    <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                  </td>

                  {/* Description */}
                  <td className="px-5 py-4">
                    <div className="h-4 w-52 rounded bg-slate-200 dark:bg-slate-700" />
                  </td>

                  {/* Purchase Price */}
                  <td className="px-5 py-4">
                    <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                  </td>

                  {/* Selling Price */}
                  <td className="px-5 py-4">
                    <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                  </td>

                  {/* Stock */}
                  <td className="px-5 py-4">
                    <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-700" />
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <div className="h-8 w-8 rounded-md bg-slate-200 dark:bg-slate-700" />
                      <div className="h-8 w-8 rounded-md bg-slate-200 dark:bg-slate-700" />
                    </div>
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
