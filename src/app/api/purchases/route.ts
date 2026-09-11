import { NextRequest, NextResponse } from "next/server";
import { getPurchases } from "@/lib/purchases/getPurchases";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const cursor = searchParams.get("cursor") ?? "";
  const search = searchParams.get("search") ?? "";
  const supplier = searchParams.get("supplier") ?? "";
  

  const data = await getPurchases({
    cursor: cursor ? Number(cursor) : undefined,
    search,
    supplierId: supplier ? Number(supplier) : undefined,
  });

  return NextResponse.json(data);
}
