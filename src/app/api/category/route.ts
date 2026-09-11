import { db } from "@/db/drizzle";
import { categoryTable } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await db.select().from(categoryTable);
        
        const response = NextResponse.json({
            message: "Category",
            categories: categories,
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}