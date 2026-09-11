"use client";

import { Search, Loader2, Clock } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

type Props = {
  sourceId: string;
};

type TranscriptItem = {
  text: string;
  offset?: number;
  duration?: number;
};

const PAGE_SIZE = 20;

/** Convert seconds → "MM:SS" or "H:MM:SS" */
function formatTime(totalSeconds: number): string {
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");

  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function TranscriptView({ sourceId }: Props) {
  const [query, setQuery] = useState("");
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  /* ── Fetch transcript ─────────────────────────────────────── */
  useEffect(() => {
    async function fetchTranscript() {
      try {
        const res = await fetch(`/api/sources/${sourceId}`);
        if (res.ok) {
          const data = await res.json();
          setTranscript(data.transcript || []);
        }
      } catch (err) {
        console.error("Failed to fetch transcript", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTranscript();
  }, [sourceId]);

  /* ── Filter by query ──────────────────────────────────────── */
  const filtered = useMemo(() => {
    if (!query.trim()) return transcript;
    const q = query.toLowerCase();
    return transcript.filter((item) => item.text.toLowerCase().includes(q));
  }, [query, transcript]);

  /* ── Reset pagination when filter changes ─────────────────── */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query]);

  /* ── Slice for current page ───────────────────────────────── */
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  function loadMore() {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
  }

  /* ── Skeleton loader ─────────────────────────────────────── */
  if (loading) {
    return (
      <div className="mx-auto mt-5 max-w-6xl space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-5 rounded-xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#0d1014] p-5"
          >
            <div className="h-5 w-14 shrink-0 animate-pulse rounded-md bg-zinc-200 dark:bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-full animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
              <div
                className="h-3.5 animate-pulse rounded bg-zinc-200 dark:bg-white/10"
                style={{ width: `${55 + (i % 4) * 12}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto mt-5 max-w-6xl">
      {/* ── Search bar ── */}
      <div className="sticky top-4 z-10 mb-4">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white/90 dark:border-white/10 dark:bg-[#0d1014]/90 px-4 shadow-sm backdrop-blur">
          <Search size={17} className="shrink-0 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transcript…"
            className="w-full bg-transparent py-3 text-sm text-black dark:text-white outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          />
          {query && (
            <span className="shrink-0 rounded-md bg-zinc-100 dark:bg-white/5 px-2 py-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* ── List ── */}
      {filtered.length > 0 ? (
        <div
          id="transcript-scroll-container"
          className="overflow-y-auto rounded-xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#0d1014]"
          style={{ maxHeight: "600px" }}
        >
          <InfiniteScroll
            dataLength={visible.length}
            next={loadMore}
            hasMore={hasMore}
            scrollableTarget="transcript-scroll-container"
            loader={
              <div className="flex items-center justify-center gap-2 border-t border-zinc-100 dark:border-white/5 py-5 text-xs text-zinc-400">
                <Loader2 size={14} className="animate-spin" />
                Loading more segments…
              </div>
            }
            endMessage={
              filtered.length > PAGE_SIZE ? (
                <p className="border-t border-zinc-100 dark:border-white/5 py-5 text-center text-xs text-zinc-400">
                  ✓ All {filtered.length} segments loaded
                </p>
              ) : null
            }
          >
            {visible.map((item, idx) => {
              const timestamp = formatTime(item.offset ?? 0);
              const isLast = idx === visible.length - 1 && !hasMore;

              return (
                <div
                  key={idx}
                  className={`group flex gap-4 p-5 transition-colors hover:bg-zinc-50 dark:hover:bg-white/3 ${
                    !isLast
                      ? "border-b border-zinc-100 dark:border-white/5"
                      : ""
                  }`}
                >
                  {/* Timestamp badge */}
                  <div className="flex shrink-0 items-start pt-1">
                    <div className="flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-white/5 px-2 py-1">
                      <Clock
                        size={10}
                        className="text-zinc-400 dark:text-zinc-500"
                      />
                      <span className="font-mono text-[11px] font-medium tabular-nums text-zinc-600 dark:text-zinc-400">
                        {timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Text */}
                  <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#0d1014] px-6 py-14 text-center">
          <Search size={24} className="text-zinc-300 dark:text-zinc-700" />
          <p className="text-sm text-zinc-500">No matching segments found.</p>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-zinc-400 underline underline-offset-2 hover:text-black dark:hover:text-white transition"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* ── Footer count ── */}
      {filtered.length > 0 && (
        <p className="mt-3 text-center text-xs text-zinc-400">
          Showing {Math.min(visibleCount, filtered.length)} of {filtered.length}{" "}
          segment{filtered.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
