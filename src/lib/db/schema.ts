import { Transcripts } from "@/types/Transcript";
import {
  pgTable,
  text,
  serial,
  vector,
  jsonb,
  timestamp,
  index,
  uuid,
  real,
} from "drizzle-orm/pg-core";

export type Citation = {
  id: number;
  startTime: number | null;
  endTime: number | null;
  startLine: number | null;
  endLine: number | null;
  url: string | null;
};

export const sources = pgTable("sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceType: text("source_type").default("youtube").notNull(),
  videoUrl: text("video_url"),
  textContent: text("text_content"),
  title: text("title").notNull(),
  duration: text("duration"),
  transcript: jsonb("transcript").$type<Transcripts>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertSource = typeof sources.$inferInsert;
export type SelectSource = typeof sources.$inferSelect;

/**
 * Persistent chat messages for a source/video.
 *
 * One source can have many messages.
 * Messages are ordered by createdAt.
 */
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    sourceId: uuid("source_id")
      .references(() => sources.id, { onDelete: "cascade" })
      .notNull(),

    role: text("role").$type<"user" | "assistant">().notNull(),

    content: text("content").notNull(),

    citations: jsonb("citations").$type<Citation[]>().default([]),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("messages_source_id_idx").on(table.sourceId),
    index("messages_created_at_idx").on(table.createdAt),
  ],
);

export type InsertMessage = typeof messages.$inferInsert;
export type SelectMessage = typeof messages.$inferSelect;

/**
 * Stores chunked transcript text with their vector embeddings.
 */
export const embeddings = pgTable(
  "embeddings",
  {
    id: serial("id").primaryKey(),

    sourceId: uuid("source_id")
      .references(() => sources.id)
      .notNull(),

    content: text("content").notNull(),

    metadata: jsonb("metadata"),

    embedding: vector("embedding", {
      dimensions: 1024,
    }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  ],
);

export type InsertEmbedding = typeof embeddings.$inferInsert;
export type SelectEmbedding = typeof embeddings.$inferSelect;

/**
 * Stores hierarchical sections generated from multiple transcript chunks.
 */
export const sections = pgTable(
  "sections",
  {
    id: serial("id").primaryKey(),

    sourceId: uuid("source_id")
      .references(() => sources.id, { onDelete: "cascade" })
      .notNull(),

    title: text("title").notNull(),
    summary: text("summary").notNull(),
    importantConcepts: jsonb("important_concepts").$type<string[]>(),

    startTime: real("start_time_sec"),
    endTime: real("end_time_sec"),

    embedding: vector("embedding", {
      dimensions: 1024,
    }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("sectionEmbeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
    index("sections_source_id_idx").on(table.sourceId),
  ],
);

export type InsertSection = typeof sections.$inferInsert;
export type SelectSection = typeof sections.$inferSelect;
