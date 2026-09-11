import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

import {
  createMessage,
  findSimilarChunksForVideo,
  findSimilarSectionsForVideo,
  getMessagesBySourceId,
  getSourceVideoUrl,
} from "@/lib/db/queries";

import { generateQueryEmbedding } from "@/lib/ai/embeddings";
import createYouTubeTimestampUrl from "@/lib/youtube/TimestampUrl";
import { planQuery } from "@/lib/ai/planner";
import { executeMultiQueryRetrieval } from "@/lib/ai/retrieval";

const SYSTEM_PROMPT = `
You are an expert research assistant that answers questions about the content of a YouTube video.

Your job is to deeply understand the provided transcript excerpts and conversation history and produce a high-quality, natural, well-structured answer to the user's question.

SOURCE GROUNDING:

1. Use the transcript excerpts as your primary and authoritative source.
2. Do not invent information that is not supported by the transcript.
3. Do not use outside knowledge to fill gaps or make unsupported assumptions.
4. You may connect, synthesize, and organize information from different parts of the transcript.
5. When multiple transcript excerpts discuss the same idea, combine them into a coherent explanation.
6. Ignore excerpts that are irrelevant to the user's question.
7. If the transcript contains conflicting or uncertain statements, acknowledge the uncertainty.
8. Never fabricate quotes, statistics, names, events, examples, conclusions, or claims.

CONVERSATION:

9. Use previous conversation messages to understand follow-up questions.
10. A user may refer to something using phrases such as "that", "it", "the second point", or "explain this further".
11. Resolve those references using the previous conversation when possible.
12. Do not treat previous assistant answers as authoritative evidence. The transcript remains the authoritative source.

ANSWER QUALITY:

13. Answer the user's actual question directly.
14. Do not simply repeat individual transcript excerpts.
15. Synthesize information across relevant excerpts.
16. Explain important ideas in enough detail to genuinely help the user.
17. Preserve important nuance, reasoning, examples, arguments, and conclusions from the video.
18. When the speaker explains a process, describe important steps in the correct order.
19. When the speaker presents an argument, explain the main claim, reasoning, and supporting points.
20. When multiple topics are involved, clearly distinguish between them.
21. Use headings, bullet points, numbered lists, or paragraphs when useful.
22. Do not artificially shorten answers.

ANSWER LENGTH:

23. Match the length of the answer to the scope of the user's question.
24. Simple factual questions can be concise but complete.
25. Explanations should contain enough detail to properly explain the concept.
26. For summaries or overviews, provide a substantial and well-structured answer.
27. Do not produce a 5-6 line answer for a broad overview.
28. Prefer completeness and usefulness over brevity.
29. Do not add filler merely to make the answer longer.

INSUFFICIENT INFORMATION:

30. If the provided transcript excerpts genuinely do not contain enough information to answer the question, say:

"I couldn't find enough information in this video to answer that."

31. Do not use this response merely because one retrieved excerpt is incomplete. Consider all provided excerpts.

STYLE:

32. Write naturally and conversationally.
33. Avoid unnecessary phrases such as:
"According to the provided context..."
"Based on the retrieved information..."
"The transcript says..."
unless explicitly relevant.

34. Do not mention embeddings, vector databases, semantic search, retrieval, chunks, RAG, or internal implementation details.
35. Do not expose your reasoning process.
36. Return only the final answer.

MARKDOWN:

37. Return the answer in Markdown.
38. Use ## for major sections.
39. Use ### for subsections when appropriate.
40. Use numbered lists for sequential processes.
41. Use bullet lists for related points.
42. Use **bold** for important terms.
43. Use inline code for code, commands, or technical identifiers.
44. Use tables only when they genuinely improve comprehension.
`;

function formatTimestamp(seconds: number) {
  const totalSeconds = Math.floor(seconds);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const sourceId = searchParams.get("sourceId");

    if (!sourceId) {
      return NextResponse.json(
        { error: "sourceId is required" },
        { status: 400 },
      );
    }

    const messages = await getMessagesBySourceId(sourceId);

    return NextResponse.json({
      messages: messages.map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        citations: message.citations ?? [],
        createdAt: message.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get chat history error:", error);

    return NextResponse.json(
      { error: "Failed to load chat history" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { sourceId, query } = await req.json();

    if (!sourceId || !query) {
      return NextResponse.json(
        {
          error: "sourceId and query are required",
        },
        {
          status: 400,
        },
      );
    }

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return NextResponse.json(
        {
          error: "Query cannot be empty",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Get previous conversation.
     */
    const previousMessages = await getMessagesBySourceId(sourceId);

    /*
     * Save the user's message immediately.
     */
    await createMessage({
      sourceId,
      role: "user",
      content: trimmedQuery,
      citations: [],
    });

    /*
     * Build conversation history string for the planner.
     */
    const conversationHistoryString = previousMessages
      .slice(-20)
      .map(
        (message) =>
          `${message.role === "user" ? "User" : "Assistant"}:\n${message.content}`,
      )
      .join("\n\n");

    /*
     * 1. Plan the query using Gemini.
     */
    const plan = await planQuery(trimmedQuery, conversationHistoryString);
    console.log("Query Plan:", plan);

    let transcriptContext = "";
    let citationData: any[] = [];

    if (plan.strategy === "global") {
      /*
       * Global search: Search over sections instead of chunks.
       */
      const queryEmbedding = await generateQueryEmbedding(trimmedQuery);
      if (!queryEmbedding)
        throw new Error("Failed to generate query embedding");

      const sections = await findSimilarSectionsForVideo(
        queryEmbedding,
        sourceId,
        10,
      );
      citationData = sections;

      if (sections.length === 0) {
        // Fallback if no sections exist yet
        console.log("No sections found, falling back to chunks");
        const fallbackResults = await executeMultiQueryRetrieval(
          [trimmedQuery],
          sourceId,
        );
        citationData = fallbackResults;
      }

      transcriptContext = citationData
        .map((item, index) => {
          if ("summary" in item) {
            // It's a section
            return `
Section Excerpt ${index + 1}
Reference ID: ${index + 1}
Title: ${item.title}
Timestamp: ${item.startTime !== null ? formatTimestamp(item.startTime) : "Unknown"} - ${item.endTime !== null ? formatTimestamp(item.endTime) : "Unknown"}

Summary:
${item.summary}

Important Concepts:
${item.importantConcepts ? item.importantConcepts.join(", ") : "None"}
`;
          } else {
            // It's a chunk
            return `Transcript Excerpt ${index + 1}\nContent:\n${item.content}`;
          }
        })
        .join("\n\n---\n\n");
    } else {
      /*
       * Single or Multi-query: Search over chunks.
       */
      const queriesToRun =
        plan.strategy === "single_query" ? [trimmedQuery] : plan.queries;
      const results = await executeMultiQueryRetrieval(queriesToRun, sourceId);
      citationData = results;

      transcriptContext = results
        .map((result, index) => {
          const metadata = result.metadata as {
            timestamp?: { start?: number; end?: number };
            loc?: { lines?: { from?: number; to?: number } };
          };

          const startTime = metadata?.timestamp?.start;
          const endTime = metadata?.timestamp?.end;
          const startLine = metadata?.loc?.lines?.from;
          const endLine = metadata?.loc?.lines?.to;

          return `
Transcript Excerpt ${index + 1}
Reference ID: ${index + 1}

Timestamp:
${startTime !== undefined ? formatTimestamp(startTime) : "Unknown"} - ${
            endTime !== undefined ? formatTimestamp(endTime) : "Unknown"
          }

Transcript Lines:
${startLine !== undefined ? startLine : "Unknown"} - ${
            endLine !== undefined ? endLine : "Unknown"
          }

Content:
${result.content}
`;
        })
        .join("\n\n---\n\n");
    }

    if (citationData.length === 0) {
      const answer =
        "I couldn't find enough information in this video to answer that.";

      const savedMessage = await createMessage({
        sourceId,
        role: "assistant",
        content: answer,
        citations: [],
      });

      return NextResponse.json({ id: savedMessage.id, answer, citations: [] });
    }

    const conversationHistory = conversationHistoryString;

    /*
     * Generate the response with AI SDK.
     */
    const result = streamText({
      model: google("gemini-3.1-flash-lite"),
      system: SYSTEM_PROMPT,
      prompt: `
CONVERSATION HISTORY:

${conversationHistory || "No previous conversation."}

---

RELEVANT VIDEO TRANSCRIPT:

${transcriptContext}

---

CURRENT USER QUESTION:

${trimmedQuery}
`,

      temperature: 0,

      async onFinish({ text }) {
        const videoUrl = await getSourceVideoUrl(sourceId);

        const citations = citationData.map((result, index) => {
          let startTime = null;
          let endTime = null;
          let startLine = null;
          let endLine = null;

          if ("summary" in result) {
            // It's a section
            startTime = result.startTime;
            endTime = result.endTime;
          } else {
            // It's a chunk
            const metadata = result.metadata as any;
            startTime = metadata?.timestamp?.start ?? null;
            endTime = metadata?.timestamp?.end ?? null;
            startLine = metadata?.loc?.lines?.from ?? null;
            endLine = metadata?.loc?.lines?.to ?? null;
          }

          return {
            id: index + 1,
            startTime,
            endTime,
            startLine,
            endLine,
            url: createYouTubeTimestampUrl(videoUrl!, startTime ?? 0),
          };
        });

        await createMessage({
          sourceId,
          role: "assistant",
          content: text,
          citations,
        });
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("RAG chat error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate answer",
      },
      {
        status: 500,
      },
    );
  }
}
