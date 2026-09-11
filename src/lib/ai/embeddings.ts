import { MistralAIEmbeddings } from "@langchain/mistralai";

const mistralEmbeddings = new MistralAIEmbeddings({
  apiKey: process.env.MISTRAL_EMBEDDINGS_API_KEY,
  model: "mistral-embed",
});

// Mistral recommends batching embedding inputs.
// Keep this conservative rather than sending hundreds of inputs
// in a single API request.
const EMBEDDING_BATCH_SIZE = 32;

export async function generateEmbeddings(texts: string[]) {
  if (!texts.length) {
    return [];
  }

  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += EMBEDDING_BATCH_SIZE) {
    const batch = texts.slice(i, i + EMBEDDING_BATCH_SIZE);

    console.log(
      `Generating embeddings: ${Math.min(i + batch.length, texts.length)}/${texts.length}`,
    );

    const embeddings = await mistralEmbeddings.embedDocuments(batch);

    allEmbeddings.push(...embeddings);
  }

  return allEmbeddings;
}

export async function generateQueryEmbedding(query: string) {
  const [embedding] = await mistralEmbeddings.embedDocuments([query]);

  return embedding;
}
