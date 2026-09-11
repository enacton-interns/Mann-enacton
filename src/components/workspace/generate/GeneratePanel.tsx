"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Users,
  X,
  FileText,
  Mail,
} from "lucide-react";

type ContentType = "linkedin" | "twitter" | "blog" | "newsletter";

const contentTypes = [
  {
    id: "linkedin" as ContentType,
    title: "LinkedIn Post",
    description: "Professional thought leadership",
    icon: Users,
  },
  {
    id: "twitter" as ContentType,
    title: "X Thread",
    description: "Short-form educational thread",
    icon: X,
  },
  {
    id: "blog" as ContentType,
    title: "Blog Post",
    description: "In-depth SEO-optimized article",
    icon: FileText,
  },
  {
    id: "newsletter" as ContentType,
    title: "Newsletter",
    description: "Engaging email format",
    icon: Mail,
  },
];

type GeneratePanelProps = {
  sourceId: string;
  onGenerate?: (content: string, type: ContentType) => void;
  onGenerating?: (loading: boolean, type: ContentType) => void;
};

export default function GeneratePanel({
  sourceId,
  onGenerate,
  onGenerating,
}: GeneratePanelProps) {
  const [type, setType] = useState<ContentType>("linkedin");
  const [tone, setTone] = useState("educational");
  const [length, setLength] = useState("medium");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (loading) return;

    setLoading(true);
    onGenerating?.(true, type);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId, type, tone, length }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error || "Generation failed");
      }

      const data = await response.json();

      if (!data.content) {
        throw new Error("No content was returned");
      }

      onGenerate?.(data.content, type);
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setLoading(false);
      onGenerating?.(false, type);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {/* Content types */}
      <div>
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            What do you want to create?
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Choose a format and we'll use relevant sections from your source.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {contentTypes.map((item) => {
            const Icon = item.icon;
            const active = type === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setType(item.id)}
                disabled={loading}
                className={`rounded-xl border p-5 text-left transition ${
                  active
                    ? "border-zinc-300 bg-zinc-100 dark:border-white/30 dark:bg-white/[0.07]"
                    : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-white/10 dark:bg-[#0d1014] dark:hover:border-white/20"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <div
                  className={`mb-5 flex h-10 w-10 items-center justify-center rounded-lg ${
                    active
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-zinc-100 text-zinc-500 dark:bg-white/5 dark:text-zinc-400"
                  }`}
                >
                  <Icon size={18} />
                </div>

                <p className="font-medium text-black dark:text-white">
                  {item.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-600">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <aside className="rounded-xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#0d1014] p-5">
        <div className="mb-6 flex items-center gap-2 text-black dark:text-white">
          <Sparkles size={16} />
          <h3 className="font-medium">Generation settings</h3>
        </div>

        <div className="space-y-5">
          {/* Tone */}
          <label className="block">
            <span className="mb-2 block text-xs text-zinc-500">Tone</span>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 text-black dark:border-white/10 dark:bg-black/20 dark:text-white px-3 py-2.5 text-sm outline-none"
            >
              <option value="educational">Educational</option>
              <option value="professional">Professional</option>
              <option value="conversational">Conversational</option>
              <option value="provocative">Provocative</option>
            </select>
          </label>

          {/* Length */}
          <label className="block">
            <span className="mb-2 block text-xs text-zinc-500">Length</span>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 text-black dark:border-white/10 dark:bg-black/20 dark:text-white px-3 py-2.5 text-sm outline-none"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </label>

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-black text-white dark:bg-white dark:text-black px-4 py-3 text-sm font-medium transition hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate content
              </>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}
