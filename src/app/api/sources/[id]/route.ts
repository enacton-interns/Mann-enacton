import { NextResponse } from "next/server";
import { getSourceById } from "@/lib/db/queries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const source = await getSourceById(id);

    if (!source) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }

    return NextResponse.json({
      transcript: source.transcript,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch transcript" },
      { status: 500 },
    );
  }
}
