import { notFound } from "next/navigation";
import SourceHeader from "@/components/workspace/SourceHeader";
import Workspace from "@/components/workspace/Workspace";
import { getSourceById } from "@/lib/db/queries";

export default async function SourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const source = await getSourceById(id);

  if (!source) {
    notFound();
  }

  return (
    <main className="min-h-screen lg:pl-64">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <SourceHeader
          title={source.title}
          duration={source.duration || "N/A"}
          videoUrl={source.videoUrl}
        />

        <Workspace sourceId={id} />
      </div>
    </main>
  );
}
