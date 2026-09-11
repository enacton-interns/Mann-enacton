import { cosineDistance, desc, eq, gt, asc, sql } from "drizzle-orm";
import { db } from "./index";
import {
  embeddings,
  messages,
  sections,
  SelectMessage,
  SelectSource,
  sources,
  type InsertEmbedding,
  type InsertMessage,
  type InsertSource,
  type InsertSection,
} from "./schema";

export async function createSource(data: InsertSource) {
  const result = await db.insert(sources).values(data).returning();
  return result[0];
}

export async function getSources(): Promise<{ id: string; title: string }[]> {
  return await db
    .select({
      id: sources.id,
      title: sources.title,
    })
    .from(sources)
    .orderBy(desc(sources.createdAt));
}

export async function getLimitedSources(limit: number = 3) {
  return await db
    .select()
    .from(sources)
    .orderBy(desc(sources.createdAt))
    .limit(limit);
}

export async function getSourceById(
  id: string,
): Promise<SelectSource | undefined> {
  const result = await db
    .select()
    .from(sources)
    .where(eq(sources.id, id))
    .limit(1);

  return result[0];
}

/**
 * Insert chunked embeddings into the database in batch.
 */
export async function insertEmbeddings(
  chunks: {
    content: string;
    metadata: Record<string, unknown>;
    embedding: number[];
  }[],
  sourceId: string,
) {
  const rows: InsertEmbedding[] = chunks.map((chunk) => ({
    content: chunk.content,
    metadata: chunk.metadata,
    embedding: chunk.embedding,
    sourceId,
  }));

  await db.insert(embeddings).values(rows);

  return rows.length;
}

/**
 * Find the most similar chunks to a query embedding using cosine similarity.
 */
export async function findSimilarChunks(
  queryEmbedding: number[],
  topK = 3,
  minSimilarity = 0.2,
) {
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    queryEmbedding,
  )})`;

  const results = await db
    .select({
      id: embeddings.id,
      content: embeddings.content,
      metadata: embeddings.metadata,
      sourceId: embeddings.sourceId,
      similarity,
    })
    .from(embeddings)
    .where(gt(similarity, minSimilarity))
    .orderBy(desc(similarity))
    .limit(topK);

  return results;
}

/**
 * Find similar chunks for a given source ID only.
 */
export async function findSimilarChunksForVideo(
  queryEmbedding: number[],
  sourceId: string,
  topK = 3,
  minSimilarity = 0.2,
) {
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    queryEmbedding,
  )})`;

  const results = await db
    .select({
      id: embeddings.id,
      content: embeddings.content,
      metadata: embeddings.metadata,
      similarity,
    })
    .from(embeddings)
    .where(
      sql`${gt(similarity, minSimilarity)} AND ${embeddings.sourceId} = ${sourceId}`,
    )
    .orderBy(desc(similarity))
    .limit(topK);

  return results;
}

/**
 * Insert generated sections into the database in batch.
 */
export async function insertSections(
  sectionRows: InsertSection[]
) {
  await db.insert(sections).values(sectionRows);
  return sectionRows.length;
}

/**
 * Find similar sections for a given source ID.
 */
export async function findSimilarSectionsForVideo(
  queryEmbedding: number[],
  sourceId: string,
  topK = 5,
  minSimilarity = 0.2,
) {
  const similarity = sql<number>`1 - (${cosineDistance(
    sections.embedding,
    queryEmbedding,
  )})`;

  const results = await db
    .select({
      id: sections.id,
      title: sections.title,
      summary: sections.summary,
      importantConcepts: sections.importantConcepts,
      startTime: sections.startTime,
      endTime: sections.endTime,
      similarity,
    })
    .from(sections)
    .where(
      sql`${gt(similarity, minSimilarity)} AND ${sections.sourceId} = ${sourceId}`,
    )
    .orderBy(desc(similarity))
    .limit(topK);

  return results;
}

export async function getSourceVideoUrl(sourceId: string) {
  const result = await db
    .select({
      videoUrl: sources.videoUrl,
    })
    .from(sources)
    .where(eq(sources.id, sourceId))
    .limit(1);

  return result[0]?.videoUrl ?? null;
}

/* -------------------------------------------------------------------------- */
/* Messages                                                                   */
/* -------------------------------------------------------------------------- */

export async function createMessage(data: InsertMessage) {
  const result = await db.insert(messages).values(data).returning();

  return result[0];
}

export async function getMessagesBySourceId(
  sourceId: string,
): Promise<SelectMessage[]> {
  return await db
    .select()
    .from(messages)
    .where(eq(messages.sourceId, sourceId))
    .orderBy(asc(messages.createdAt));
}

export async function deleteMessagesBySourceId(sourceId: string) {
  await db.delete(messages).where(eq(messages.sourceId, sourceId));
}
