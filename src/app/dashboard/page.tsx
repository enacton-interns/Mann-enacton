import AddSource from "@/components/dashboard/AddSource";
import RecentSources from "@/components/dashboard/RecentSources";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <main className="min-h-screen lg:pl-64">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-10">
          <p className="mb-2 text-sm text-zinc-500">Content workspace</p>

          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-white">
            Turn ideas into content.
          </h1>

          <p className="mt-2 max-w-xl text-zinc-500 dark:text-zinc-400">
            Analyze long-form content, discover important themes, and transform
            them into social media assets.
          </p>
        </div>

        <AddSource />

        <RecentSources />
      </div>
    </main>
  );
}
