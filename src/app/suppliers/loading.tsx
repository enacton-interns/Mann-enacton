export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="h-9 w-44 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-4 w-64 rounded bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="h-10 w-36 rounded-lg bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Supplier Cards */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm gap-4"
          >
            {/* Supplier Info */}
            <div className="flex-1">
              {/* Name */}
              <div className="h-6 w-44 rounded bg-slate-200 dark:bg-slate-700 mb-3" />

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {/* Email */}
                <div className="h-4 w-52 rounded bg-slate-200 dark:bg-slate-700" />

                {/* Phone */}
                <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-700" />

                {/* Address */}
                <div className="h-4 w-72 rounded bg-slate-200 dark:bg-slate-700 sm:w-full" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="h-8 w-8 rounded-md bg-slate-200 dark:bg-slate-700" />
              <div className="h-8 w-8 rounded-md bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
