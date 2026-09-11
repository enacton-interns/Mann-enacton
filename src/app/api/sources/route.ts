import { NextResponse } from "next/server";
import { fetchTranscript, listLanguages } from "youtube-transcript-plus";
import { decode } from "he";
import {
  chunkTranscript,
  generateSectionsFromChunks,
  type TranscriptSegment,
} from "@/lib/ai/chunking";
import { generateEmbeddings } from "@/lib/ai/embeddings";
import {
  insertEmbeddings,
  createSource,
  getSources,
  insertSections,
} from "@/lib/db/queries";

export async function GET() {
  try {
    const sources = await getSources();

    return NextResponse.json(sources);
  } catch (error) {
    console.error("Failed to get sources:", error);

    return NextResponse.json(
      {
        error: "Failed to get sources",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: Request) {
  try {
    const {
      url,
      type = "youtube",
      textContent,
      title: reqTitle,
    } = await req.json();

    if (type === "youtube" && !url) {
      return NextResponse.json(
        { error: "URL is required for youtube source" },
        { status: 400 },
      );
    }
    if (type === "text" && !textContent) {
      return NextResponse.json(
        { error: "Text content is required for text source" },
        { status: 400 },
      );
    }

    let rawSegments: any[] = [];
    let segments: TranscriptSegment[] = [];
    let title = reqTitle || "Untitled";
    let duration = 0;

    if (type === "youtube") {
      // ---------------------------------------------------------
      // 1. Determine transcript language
      // ---------------------------------------------------------
      const languages = await listLanguages(url);
      let targetLang = "en";
      if (languages.length > 0) {
        const englishLanguage = languages.find(
          (language) => language.languageCode === "en",
        );
        targetLang = englishLanguage
          ? String(englishLanguage.languageCode)
          : String(languages[0].languageCode);
      }

      // ---------------------------------------------------------
      // 2. Fetch transcript
      // ---------------------------------------------------------
      const transcriptResponse = await fetchTranscript(url, {
        lang: targetLang,
        videoDetails: true,
      });

      rawSegments = transcriptResponse.segments;
      if (!rawSegments || rawSegments.length === 0) {
        return NextResponse.json(
          { error: "No transcript found for this video" },
          { status: 400 },
        );
      }

      // ---------------------------------------------------------
      // 3. Clean transcript segments
      // ---------------------------------------------------------
      segments = rawSegments
        .map((segment) => ({
          text: decode(segment.text).trim(),
          offset: Number(segment.offset),
          duration: Number(segment.duration),
        }))
        .filter((segment) => segment.text.length > 0);

      // ---------------------------------------------------------
      // 4. Extract YouTube metadata
      // ---------------------------------------------------------
      title = transcriptResponse.videoDetails.title;
      duration = transcriptResponse.videoDetails.lengthSeconds;
    } else {
      // Raw Text Source
      rawSegments = [{ text: textContent, offset: 0, duration: 0 }];
      segments = [{ text: textContent, offset: 0, duration: 0 }];
    }

    // ---------------------------------------------------------
    // 5. Store original transcript / text
    // ---------------------------------------------------------
    const sourceData: any = {
      title,
      duration: String(duration),
      transcript: rawSegments,
      sourceType: type,
    };
    if (type === "youtube") {
      sourceData.videoUrl = url;
    } else {
      sourceData.textContent = textContent;
    }

    const source = await createSource(sourceData);

    // ---------------------------------------------------------
    // 6. Chunk transcript
    //
    // Each chunk now contains:
    //
    // - content
    // - startIndex
    // - endIndex
    // - timestamp.start
    // - timestamp.end
    // - loc.lines.from
    // - loc.lines.to
    // ---------------------------------------------------------

    const chunks = await chunkTranscript(segments);

    console.log(`Created ${chunks.length} chunks from transcript`);

    if (chunks.length === 0) {
      return NextResponse.json(
        {
          error: "Failed to create transcript chunks",
        },
        {
          status: 500,
        },
      );
    }

    // ---------------------------------------------------------
    // 7. Generate embeddings
    // ---------------------------------------------------------

    const texts = chunks.map((chunk) => chunk.content);

    const embeddings = await generateEmbeddings(texts);

    console.log(`Generated ${embeddings.length} embeddings`);

    if (embeddings.length !== chunks.length) {
      return NextResponse.json(
        {
          error: "Number of embeddings does not match number of chunks",
        },
        {
          status: 500,
        },
      );
    }

    // ---------------------------------------------------------
    // 8. Combine chunks + metadata + embeddings
    // ---------------------------------------------------------

    const chunksWithEmbeddings = chunks.map((chunk, index) => ({
      content: chunk.content,

      metadata: chunk.metadata,

      embedding: embeddings[index],
    }));

    // ---------------------------------------------------------
    // 9. Store in pgvector
    // ---------------------------------------------------------

    const storedCount = await insertEmbeddings(chunksWithEmbeddings, source.id);

    console.log(`Stored ${storedCount} chunks in vector DB`);

    // ---------------------------------------------------------
    // 10. Generate Sections
    // ---------------------------------------------------------

    console.log("Generating sections...");
    const sections = await generateSectionsFromChunks(chunksWithEmbeddings, 20);

    if (sections.length > 0) {
      const sectionEmbeddings = await generateEmbeddings(
        sections.map((s) => s.embeddingString),
      );

      const sectionsToInsert = sections.map((section, index) => ({
        sourceId: source.id,
        title: section.title,
        summary: section.summary,
        importantConcepts: section.importantConcepts,
        startTime: section.startTime,
        endTime: section.endTime,
        embedding: sectionEmbeddings[index],
      }));

      const storedSectionsCount = await insertSections(sectionsToInsert);
      console.log(`Stored ${storedSectionsCount} sections in vector DB`);
    } else {
      console.log("No sections were generated.");
    }

    // ---------------------------------------------------------
    // 11. Return result
    // ---------------------------------------------------------

    return NextResponse.json({
      id: source.id,
      title: source.title,
      storedCount,
      totalChunks: chunks.length,
      sectionsCount: sections.length,
    });
  } catch (error) {
    console.error("Failed to process video:", error);

    return NextResponse.json(
      {
        error: "Failed to process video",
      },
      {
        status: 500,
      },
    );
  }
}
