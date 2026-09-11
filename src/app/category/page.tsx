import { db } from "@/db/drizzle";
import { categoryTable } from "@/db/schema";
import CategoryComponent from "./components/CategoryComponent";
import { asc, desc } from "drizzle-orm";

export default async function CategoryPage() {
  const categories = await db.select().from(categoryTable).orderBy(desc(categoryTable.id));

  return (
    <CategoryComponent categories={categories} />
  );
}
