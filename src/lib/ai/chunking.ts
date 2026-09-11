import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export type TranscriptSegment = {
  text: string;
  offset: number;
  duration: number;
};

export type ChunkMetadata = {
  timestamp: {
    start: number;
    end: number;
  };

  loc: {
    lines: {
      from: number;
      to: number;
    };
  };
};

export type ChunkWithMetadata = {
  content: string;
  metadata: ChunkMetadata;
};

type TranscriptRange = {
  start: number;
  end: number;
  line: number;
  offset: number;
  duration: number;
};

export async function chunkTranscript(
  segments: TranscriptSegment[],
  chunkSize = 500,
  overlap = 100,
): Promise<ChunkWithMetadata[]> {
  /*
   * Build the complete transcript while keeping track
   * of where every transcript segment exists inside it.
   */

  let fullText = "";

  const ranges: TranscriptRange[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    const text = segment.text.trim();

    if (!text) {
      continue;
    }

    const start = fullText.length;

    fullText += text + "\n";

    const end = fullText.length;

    ranges.push({
      start,
      end,
      line: i + 1,
      offset: segment.offset,
      duration: segment.duration,
    });
  }

  /*
   * Create chunks.
   *
   * We deliberately DON'T use addStartIndex because
   * your installed LangChain version doesn't support it.
   */

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap: overlap,
    separators: ["\n\n", "\n", ". ", " ", ""],
  });

  const documents = await splitter.createDocuments([fullText]);

  /*
   * Find each chunk's position inside fullText.
   */

  const chunks: ChunkWithMetadata[] = [];

  let searchFrom = 0;

  for (const document of documents) {
    const content = document.pageContent;

    /*
     * Find this chunk inside the original transcript.
     *
     * Because chunks overlap, we search starting from
     * the previous position rather than from the beginning.
     */

    const startIndex = fullText.indexOf(content, searchFrom);

    if (startIndex === -1) {
      console.warn("Could not locate chunk inside transcript:", content);

      continue;
    }

    const endIndex = startIndex + content.length;

    /*
     * Move the search position forward.
     *
     * We don't simply use endIndex because chunks overlap.
     * Instead, move forward by at least one character.
     */

    searchFrom = startIndex + Math.max(1, content.length - overlap);

    /*
     * Find transcript segments that overlap
     * with this chunk.
     */

    const overlappingRanges = ranges.filter(
      (range) => range.start < endIndex && range.end > startIndex,
    );

    if (overlappingRanges.length === 0) {
      console.warn("No transcript segments found for chunk:", content);

      continue;
    }

    const firstSegment = overlappingRanges[0];

    const lastSegment = overlappingRanges[overlappingRanges.length - 1];

    /*
     * Calculate timestamp range.
     */

    const startTime = firstSegment.offset;

    const endTime = lastSegment.offset + lastSegment.duration;

    /*
     * Store all metadata we need later.
     */

    chunks.push({
      content,

      metadata: {
        timestamp: {
          start: startTime,
          end: endTime,
        },

        loc: {
          lines: {
            from: firstSegment.line,
            to: lastSegment.line,
          },
        },
      },
    });
  }

  return chunks;
}

export const SectionSchema = z.object({
  title: z.string(),
  summary: z.string(),
  importantConcepts: z.array(z.string()),
});

export type GeneratedSection = z.infer<typeof SectionSchema> & {
  startTime: number | null;
  endTime: number | null;
  embeddingString: string;
};

export async function generateSectionsFromChunks(
  chunks: ChunkWithMetadata[],
  groupSize = 20,
): Promise<GeneratedSection[]> {
  const sections: GeneratedSection[] = [];

  for (let i = 0; i < chunks.length; i += groupSize) {
    const chunkGroup = chunks.slice(i, i + groupSize);

    const combinedText = chunkGroup.map((c) => c.content).join("\n\n");
    const startTime = chunkGroup[0].metadata.timestamp.start ?? null;
    const endTime =
      chunkGroup[chunkGroup.length - 1].metadata.timestamp.end ?? null;

    console.log(
      `Generating section for chunks ${i} to ${i + chunkGroup.length - 1}...`,
    );

    try {
      const result = await generateObject({
        model: google("gemini-3.1-flash-lite"),
        schema: SectionSchema,
        system:
          "You are an expert transcriber and summarizer. Given a sequence of transcript chunks from a video, generate a concise but descriptive title, a comprehensive summary, and a list of important concepts discussed.",
        prompt: `TRANSCRIPT CHUNKS:\n${combinedText}`,
      });

      sections.push({
        ...result.object,
        startTime,
        endTime,
        embeddingString: `Title: ${result.object.title}\nSummary: ${result.object.summary}\nConcepts: ${result.object.importantConcepts.join(", ")}`,
      });
    } catch (e) {
      console.error("Failed to generate section", e);
    }
  }

  return sections;
}
