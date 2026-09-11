import { db } from "@/db/drizzle";
import ProductClient from "./components/ProductClient";
import { categoryTable, productTable, supplierTable } from "@/db/schema";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { desc } from "drizzle-orm";

export default async function ProductsPage() {
    const allProducts = await db.select().from(productTable).orderBy(desc(productTable.id));
    const allSuppliers = await db.select().from(supplierTable);
    const allCategories = await db.select().from(categoryTable);

    const cookie = await cookies();
    const token = cookie.get("session")?.value;
    const payload = await verifyToken(token!);
    
    return (
        <ProductClient products={allProducts} categories={allCategories} suppliers={allSuppliers} role={payload.role}/>
    )
}