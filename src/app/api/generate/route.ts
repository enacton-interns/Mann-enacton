import { NextResponse } from "next/server";
import { getSourceById } from "@/lib/db/queries";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { sourceId, type, tone, length } = await req.json();

    if (!sourceId || !type) {
      return NextResponse.json(
        { error: "sourceId and type are required" },
        { status: 400 },
      );
    }

    const source = await getSourceById(sourceId);
    if (!source) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }

    // Flatten transcript segments into a single text block
    const transcriptText = (source.transcript as { text: string }[])
      ?.map((segment) => segment.text)
      .join(" ");

    if (!transcriptText) {
      return NextResponse.json(
        { error: "Transcript is empty" },
        { status: 400 },
      );
    }

    // Summarise if the transcript is too large for context
    let context = transcriptText;
    if (transcriptText.length > 30000) {
      const sumPrompt = `You are a summarizer. Summarize the following transcript comprehensively, ensuring no key concept is lost. You may write a long summary.
Transcript: ${transcriptText}`;

      const sumResponse = await generateText({
        model: google("gemini-3.1-flash-lite"),
        prompt: sumPrompt,
      });

      context = sumResponse.text;
    }

    const formatInstructions: Record<string, string> = {
      linkedin: `Write a compelling LinkedIn post. Use professional language, 1-3 short paragraphs, relevant emojis sparingly, and end with a thought-provoking question or CTA. No hashtag spam—max 3 relevant hashtags.`,
      twitter: `Write a Twitter/X thread. Start with a hook tweet, then 5-8 numbered tweets each under 280 characters. Each tweet should stand alone. End with a summary tweet and CTA.`,
      blog: `Write a full SEO-optimized blog post with: an engaging title (H1), an introduction, 4-6 sections with H2 headings, key takeaways, and a conclusion with CTA. Aim for depth and value. Use subheadings, bullet lists, and bold text for readability.`,
      newsletter: `Write an email newsletter. Include: a catchy subject line, warm greeting, 3-4 short digestible sections, one main insight or story, practical tips, and a clear CTA at the end. Keep a conversational, personal tone.`,
    };

    const formatHint =
      formatInstructions[type] ?? `Generate a ${type} post.`;

    const prompt = `
You are an expert content creator and copywriter.

SOURCE TITLE: "${source.title}"
FORMAT: ${type}
TONE: ${tone || "educational"}
LENGTH: ${length || "medium"}

FORMAT INSTRUCTIONS:
${formatHint}

TRANSCRIPT / SUMMARY:
${context}

Return ONLY the formatted content in Markdown. Do not include any preamble or meta-commentary.
    `;

    const response = await generateText({
      model: google("gemini-3.5-flash-lite"),
      prompt,
    });

    return NextResponse.json({ type, content: response.text });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 },
    );
  }
}
