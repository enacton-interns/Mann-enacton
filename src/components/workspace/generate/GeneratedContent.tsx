"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ContentType = "linkedin" | "twitter" | "blog" | "newsletter";

type GeneratedContentProps = {
  content: string;
  type: ContentType;
  onRegenerate?: () => void;
};

export default function GeneratedContent({
  content,
  type,
  onRegenerate,
}: GeneratedContentProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="mt-10">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-medium text-black dark:text-white">
            Generated content
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Based on relevant sections from your source.
          </p>
        </div>

        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-500 transition hover:bg-zinc-100 hover:text-black dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <RefreshCw size={13} />
            Regenerate
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#0d1014]">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/10 p-4">
          <span className="text-sm font-medium capitalize text-black dark:text-white">
            {type} Post
          </span>

          <button
            onClick={copy}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 transition hover:bg-zinc-100 hover:text-black dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
          >
            {copied ? (
              <>
                <Check size={13} />
                Copied
              </>
            ) : (
              <>
                <Copy size={13} />
                Copy
              </>
            )}
          </button>
        </div>

        {/* Markdown content */}
        <div className="p-6">
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  );
}
