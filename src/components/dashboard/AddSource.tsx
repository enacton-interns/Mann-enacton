"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Link2,
  Loader2,
  TvMinimalPlay,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddSource() {
  const [sourceType, setSourceType] = useState<"youtube" | "text">("youtube");
  const [url, setUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (sourceType === "youtube" && !url.trim()) return;
    if (sourceType === "text" && !textContent.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/sources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: sourceType,
          url: sourceType === "youtube" ? url : undefined,
          textContent: sourceType === "text" ? textContent : undefined,
          title:
            sourceType === "text" ? title || "Untitled Document" : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/sources/${data.id}`);
      } else {
        console.error("Failed to process source");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#0d1014] p-6">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-black/5 dark:bg-white/3 blur-3xl" />

      <div className="relative">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
              {sourceType === "youtube" ? (
                <TvMinimalPlay size={21} />
              ) : (
                <FileText size={21} />
              )}
            </div>
            <div>
              <h2 className="font-medium text-black dark:text-white">
                {sourceType === "youtube"
                  ? "Analyze a YouTube video"
                  : "Analyze Raw Text"}
              </h2>
              <p className="text-sm text-zinc-500">
                {sourceType === "youtube"
                  ? "We'll extract and understand the video's content."
                  : "Paste your raw text, notes, or article content."}
              </p>
            </div>
          </div>

          <div className="flex bg-zinc-100 dark:bg-white/5 rounded-lg p-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSourceType("youtube")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${sourceType === "youtube" ? "bg-white dark:bg-white/10 text-black dark:text-white shadow-sm" : "text-zinc-500 hover:text-black dark:hover:text-white"}`}
            >
              YouTube
            </button>
            <button
              type="button"
              onClick={() => setSourceType("text")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${sourceType === "text" ? "bg-white dark:bg-white/10 text-black dark:text-white shadow-sm" : "text-zinc-500 hover:text-black dark:hover:text-white"}`}
            >
              Raw Text
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {sourceType === "youtube" ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-black/20 px-4">
                <Link2 size={17} className="text-zinc-500" />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-black dark:text-white"
                />
              </div>
              <SubmitButton loading={loading} />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-black/20 px-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Document Title (Optional)"
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-black dark:text-white"
                />
              </div>
              <div className="flex flex-1 items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-black/20 px-4 py-3">
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Paste your text here..."
                  className="w-full min-h-30 bg-transparent text-sm outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-black dark:text-white resize-none"
                />
              </div>
              <div className="self-end">
                <SubmitButton loading={loading} />
              </div>
            </div>
          )}
        </form>

        <div className="mt-4 flex gap-6 text-xs text-zinc-500 dark:text-zinc-600">
          <span>
            ✓{" "}
            {sourceType === "youtube"
              ? "Transcript extraction"
              : "Text processing"}
          </span>
          <span>✓ Semantic indexing</span>
          <span>✓ AI-ready content</span>
        </div>
      </div>
    </section>
  );
}

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button
      disabled={loading}
      className="flex items-center justify-center gap-2 rounded-xl bg-black text-white dark:bg-white px-5 py-3 text-sm font-medium dark:text-black transition hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Analyzing
        </>
      ) : (
        <>
          Analyze
          <ArrowUpRight size={16} />
        </>
      )}
    </button>
  );
}
