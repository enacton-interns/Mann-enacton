"use server";
import { db } from "@/db/drizzle";
import { salesOrders, salesOrderItems, productTable } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createSalesOrder(formData: FormData) {
  const userId = Number(formData.get("userid"));
  const saleDate = formData.get("salesdate") as string;

  const productIds = formData.getAll("product_id").map(Number);
  const prices = formData.getAll("price").map(Number);
  const quantities = formData.getAll("quantity").map(Number);

  const items = productIds.map((productId, index) => ({
    productId,
    sellingPrice: prices[index],
    quantity: quantities[index],
    total: prices[index] * quantities[index],
  }));

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  // Fetch every required product in one query
  const products = await db
    .select({
      id: productTable.id,
      name: productTable.name,
      stock: productTable.stock,
    })
    .from(productTable)
    .where(inArray(productTable.id, productIds));

  const productMap = new Map(products.map((p) => [p.id, p]));

  // Validate products & stock
  for (const item of items) {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    if (product.stock < item.quantity) {
      throw new Error(
        `${product.name} has only ${product.stock} items available`,
      );
    }
  }

  // Create sale
  const [sale] = await db
    .insert(salesOrders)
    .values({
      userId,
      saleDate,
      totalAmount,
    })
    .returning({
      id: salesOrders.id,
    });

  // Update stock
  for (const item of items) {
    await db
      .update(productTable)
      .set({
        stock: sql`${productTable.stock} - ${item.quantity}`,
      })
      .where(eq(productTable.id, item.productId));
  }

  // Bulk insert all sale items
  await db.insert(salesOrderItems).values(
    items.map((item) => ({
      salesOrderId: sale.id,
      productId: item.productId,
      sellingPrice: item.sellingPrice,
      quantity: item.quantity,
      totalAmount: item.total,
    })),
  );

  return {
    id: sale.id,
    saleDate,
    totalAmount,
    items,
  };
}