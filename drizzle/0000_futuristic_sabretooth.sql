CREATE TABLE "embeddings" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" uuid NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb,
	"embedding" vector(1024) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"citations" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" uuid NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"important_concepts" jsonb,
	"start_time_sec" real,
	"end_time_sec" real,
	"embedding" vector(1024) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_type" text DEFAULT 'youtube' NOT NULL,
	"video_url" text,
	"text_content" text,
	"title" text NOT NULL,
	"duration" text,
	"transcript" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "embeddings" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "messages_source_id_idx" ON "messages" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "sectionEmbeddingIndex" ON "sections" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "sections_source_id_idx" ON "sections" USING btree ("source_id");