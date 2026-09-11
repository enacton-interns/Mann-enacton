import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const QueryPlanSchema = z.object({
  intent: z.enum([
    "specific_concept",
    "concept_explanation",
    "comparison",
    "process",
    "global_summary",
    "list",
    "timeline",
    "example",
    "troubleshooting",
    "follow_up",
  ]),
  strategy: z.enum(["single_query", "multi_query", "global"]),
  queries: z.array(z.string()).describe("Search queries optimized for vector search"),
});

export type QueryPlan = z.infer<typeof QueryPlanSchema>;

const PLANNER_SYSTEM_PROMPT = `
You are a highly capable query planner for a Retrieval-Augmented Generation (RAG) system.
Your goal is to analyze the user's question (and the conversation history) and output the optimal retrieval strategy.

We have a database of transcript chunks from a YouTube video, and a higher-level database of "sections" (summaries of groups of chunks).

Given the user's question, determine:
1. "intent": the type of question.
2. "strategy": the retrieval strategy to use.
    - "single_query": for specific, narrow questions (e.g., "What is Server Components?").
    - "multi_query": for complex questions requiring multiple angles, comparisons, or broad concepts (e.g., "How does authentication work?", "Difference between X and Y").
    - "global": for holistic questions about the entire video (e.g., "What are the top 5 concepts?", "Summarize the course", "Give me an overview").
3. "queries": the actual text to send to the vector database.
    - If "single_query", just return the query.
    - If "multi_query", return 3-5 distinct sub-queries or related keywords to maximize retrieval coverage.
    - If "global", return broad queries like "major topics covered", "main concepts taught", "course sections".

Use the conversation history to resolve references (like "Explain the second one").

Do NOT answer the question. Only generate the query plan.
`;

export async function planQuery(
  userQuery: string,
  conversationHistory: string
): Promise<QueryPlan> {
  const result = await generateObject({
    model: google("gemini-3.1-flash-lite"),
    schema: QueryPlanSchema,
    system: PLANNER_SYSTEM_PROMPT,
    prompt: `
CONVERSATION HISTORY:
${conversationHistory || "No previous conversation."}

CURRENT USER QUESTION:
${userQuery}
`,
  });

  return result.object;
}
