export default function ProductHistorySkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-9 w-64 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      {/* Transaction History Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {/* Card Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            {/* Table Head */}
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {Array.from({ length: 6 }).map((_, index) => (
                  <th key={index} className="px-6 py-3">
                    <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {Array.from({ length: 8 }).map((_, row) => (
                <tr
                  key={row}
                  className="border-t border-slate-200 dark:border-slate-800"
                >
                  <td className="px-6 py-4">
                    <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
                  </td>

                  <td className="px-6 py-4">
                    <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
                  </td>

                  <td className="px-6 py-4">
                    <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-700" />
                  </td>

                  <td className="px-6 py-4">
                    <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-700" />
                  </td>

                  <td className="px-6 py-4">
                    <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                  </td>

                  <td className="px-6 py-4">
                    <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
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
