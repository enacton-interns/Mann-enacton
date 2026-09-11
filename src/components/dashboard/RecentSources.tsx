import Link from "next/link";
import { ArrowUpRight, Clock3, TvMinimalPlay } from "lucide-react";
import { getLimitedSources } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function RecentSources() {
  const sources = await getLimitedSources();
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-medium text-black dark:text-white">
            Recent sources
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Your recently processed content.
          </p>
        </div>

        <Link
          href="/sources"
          className="flex items-center gap-1 text-sm text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition"
        >
          View all
          <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#0d1014]">
        {sources.map((source, index) => (
          <Link
            key={source.id}
            href={`/sources/${source.id}`}
            className={`flex items-center gap-4 p-4 transition hover:bg-zinc-50 dark:hover:bg-white/3 sm:p-5 ${
              index !== sources.length - 1
                ? "border-b border-zinc-200 dark:border-white/10"
                : ""
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500 dark:text-red-400">
              <TvMinimalPlay size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-medium text-black dark:text-white">
                {source.title}
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-600">
                <span className="flex items-center gap-1">
                  <Clock3 size={12} />
                  {source.duration}
                </span>
              </div>
            </div>

            <span className="hidden text-xs text-zinc-500 dark:text-zinc-600 sm:block">
              {source.createdAt.toLocaleDateString()}
            </span>

            <ArrowUpRight
              size={16}
              className="text-zinc-400 dark:text-zinc-600"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
