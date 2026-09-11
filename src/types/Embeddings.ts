export type Embeddings = {
  id?: string;
  sourceId?: string;
  content?: string;
  metadata?: Record<string, unknown>;
  embedding?: number[];
};
