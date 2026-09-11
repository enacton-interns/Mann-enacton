export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="h-9 w-48 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-4 w-64 rounded bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="h-10 w-40 rounded-lg bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm gap-4"
          >
            {/* Title */}
            <div>
              <div className="h-6 w-36 rounded bg-slate-200 dark:bg-slate-700 mb-3" />
              <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 mt-auto pt-2">
              <div className="h-8 w-8 rounded-md bg-slate-200 dark:bg-slate-700" />
              <div className="h-8 w-8 rounded-md bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
