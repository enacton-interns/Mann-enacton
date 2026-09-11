import Link from "next/link";
import { ArrowLeft, ExternalLink, TvMinimalPlay } from "lucide-react";

type SourceHeaderProps = {
  title: string;
  duration: string;
  videoUrl: string | null;
};

export default function SourceHeader({
  title,
  duration,
  videoUrl,
}: SourceHeaderProps) {
  return (
    <div className="mb-8">
      <Link
        href="/sources"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black dark:hover:text-white transition"
      >
        <ArrowLeft size={15} />
        Back to sources
      </Link>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500 dark:text-red-400">
            <TvMinimalPlay size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">{title}</h1>

            <p className="mt-1 text-sm text-zinc-500">YouTube · {duration}</p>
          </div>
        </div>

        {videoUrl && (
          <Link
            href={videoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-lg border border-zinc-200 dark:border-white/10 px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition"
          >
            Original video
            <ExternalLink size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
