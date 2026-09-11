"use client";
import Link from "next/link";
import { ArrowUpRight, Search, TvMinimalPlay } from "lucide-react";
import { useState } from "react";

export default function Sources({
  sources,
}: {
  sources: { id: string; title: string }[];
}) {
  const [search, setSearch] = useState("");
  const filteredSources = sources.filter((source) =>
    source.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-screen lg:pl-64">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-sm text-zinc-500">Library</p>

          <h1 className="mt-2 text-3xl font-semibold text-black dark:text-white">
            Sources
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            All of your processed long-form content.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#0d1014] px-4">
          <Search size={17} className="shrink-0 text-zinc-400" />

          <input
            placeholder="Search sources…"
            className="w-full bg-transparent py-3 text-sm text-black dark:text-white outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />

          {search && (
            <span className="shrink-0 rounded-md bg-zinc-100 dark:bg-white/5 px-2 py-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {filteredSources.length} result{filteredSources.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Sources list */}
        {filteredSources.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#0d1014]">
            {filteredSources.map((source, index) => (
              <Link
                key={source.id}
                href={`/sources/${source.id}`}
                className={`flex items-center gap-4 p-5 transition hover:bg-zinc-50 dark:hover:bg-white/3 ${
                  index !== filteredSources.length - 1
                    ? "border-b border-zinc-100 dark:border-white/10"
                    : ""
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500 dark:text-red-400">
                  <TvMinimalPlay size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-medium text-black dark:text-white">
                    {source.title}
                  </h2>
                </div>

                <ArrowUpRight size={17} className="shrink-0 text-zinc-400 dark:text-zinc-600" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 dark:border-white/10 px-6 py-16 text-center">
            <Search size={24} className="text-zinc-300 dark:text-zinc-700" />
            <p className="text-sm text-zinc-500">No sources found.</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs text-zinc-400 underline underline-offset-2 hover:text-black dark:hover:text-white transition"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
