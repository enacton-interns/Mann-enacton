import { NextRequest, NextResponse } from "next/server";
import { getSales } from "@/lib/sales/getSales";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const cursor = searchParams.get("cursor");
  const search = searchParams.get("search") ?? "";

  const data = await getSales({
    cursor: cursor ? Number(cursor) : undefined,
    search,
  });

  return NextResponse.json(data);
}
