import Sources from "@/components/Sources/Source";
import { getSources } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const sources = await getSources();
  return <Sources sources={sources} />;
}
