import { generateQueryEmbedding } from "./embeddings";
import { findSimilarChunksForVideo } from "@/lib/db/queries";

export type RetrievalResult = {
  id: number;
  content: string;
  metadata: unknown;
  similarity: number;
};

export async function executeMultiQueryRetrieval(
  queries: string[],
  sourceId: string,
  chunksPerQuery: number = 8
): Promise<RetrievalResult[]> {
  // 1. Generate embeddings for all queries
  const embeddings = await Promise.all(
    queries.map((q) => generateQueryEmbedding(q))
  );

  // 2. Search for chunks for each query
  const allResults = await Promise.all(
    embeddings.map((embedding) =>
      findSimilarChunksForVideo(embedding, sourceId, chunksPerQuery)
    )
  );

  // 3. Merge and deduplicate by chunk ID
  const deduplicated = new Map<number, RetrievalResult>();

  for (const resultsSet of allResults) {
    for (const chunk of resultsSet) {
      const existing = deduplicated.get(chunk.id);
      
      // If we haven't seen this chunk yet, or if this query found it with higher similarity
      if (!existing || chunk.similarity > existing.similarity) {
        deduplicated.set(chunk.id, chunk);
      }
    }
  }

  // 4. Sort by highest similarity
  const finalResults = Array.from(deduplicated.values()).sort(
    (a, b) => b.similarity - a.similarity
  );

  return finalResults;
}
