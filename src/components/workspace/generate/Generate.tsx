"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import GeneratePanel from "./GeneratePanel";
import GeneratedContent from "./GeneratedContent";

type ContentType = "linkedin" | "twitter" | "blog" | "newsletter";

const typeLabels: Record<ContentType, string> = {
  linkedin: "LinkedIn Post",
  twitter: "X Thread",
  blog: "Blog Post",
  newsletter: "Newsletter",
};

type GeneratedResult = {
  content: string;
  type: ContentType;
};

type Props = {
  sourceId: string;
};

/* ── Animated generation overlay ──────────────────────────── */
function GeneratingOverlay({ type }: { type: ContentType }) {
  const label = typeLabels[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#0d1014] px-10 py-10 shadow-2xl text-center max-w-sm mx-4">
        {/* Animated rings */}
        <div className="relative flex items-center justify-center">
          <span className="absolute h-20 w-20 animate-ping rounded-full bg-black/10 dark:bg-white/10" />
          <span className="absolute h-14 w-14 animate-ping rounded-full bg-black/10 dark:bg-white/10 [animation-delay:200ms]" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-black dark:bg-white shadow-lg">
            <Sparkles
              size={28}
              className="text-white dark:text-black animate-pulse"
            />
          </div>
        </div>

        {/* Label */}
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-1">
            Generating
          </p>
          <h3 className="text-lg font-semibold text-black dark:text-white">
            {label}
          </h3>
        </div>

        {/* Progress bar */}
        <div className="w-full rounded-full bg-zinc-100 dark:bg-white/10 h-1 overflow-hidden">
          <div className="h-full bg-black dark:bg-white rounded-full animate-[grow_3s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────── */
export default function Generate({ sourceId }: Props) {
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatingType, setGeneratingType] = useState<ContentType>("linkedin");

  function handleGenerate(content: string, type: ContentType) {
    setResult({ content, type });
  }

  function handleGenerating(loading: boolean, type: ContentType) {
    setGenerating(loading);
    setGeneratingType(type);
    if (loading) setResult(null); // clear old result when starting fresh
  }

  function handleRegenerate() {
    setResult(null);
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Cool generating overlay */}
      {generating && <GeneratingOverlay type={generatingType} />}

      <GeneratePanel
        sourceId={sourceId}
        onGenerate={handleGenerate}
        onGenerating={handleGenerating}
      />

      {result && (
        <GeneratedContent
          content={result.content}
          type={result.type}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
}
