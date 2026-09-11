"use server";

import { db } from "@/db/drizzle";
import { purchaseOrders, purchaseOrderItems, productTable } from "@/db/schema";
import { PurchaseSchema } from "@/lib/validators/purchase";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createPurchaseOrder(formData: FormData) {

  const items = formData.getAll("product_id").map((productId, index) => ({
    productId,
    purchasePrice: formData.getAll("price")[index],
    quantity: formData.getAll("quantity")[index],
  }));

  const parsed = PurchaseSchema.safeParse({
    supplierId: formData.get("supplierid"),
    purchaseDate: formData.get("purchasedate"),
    items,
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { supplierId, purchaseDate, items: validatedItems } = parsed.data;

  const totalAmount = validatedItems.reduce(
    (acc, item) => acc + item.purchasePrice * item.quantity,
    0,
  );

  try {
    const purchase = await db
      .insert(purchaseOrders)
      .values({
        supplierId,
        purchaseDate,
        totalAmount,
      })
      .returning({
        id: purchaseOrders.id,
      });

    const purchaseId = purchase[0].id;

    const purchaseItems = [];

    for (const item of validatedItems) {
      const itemTotal = item.purchasePrice * item.quantity;

      purchaseItems.push({
        productId: item.productId,
        purchasePrice: item.purchasePrice,
        quantity: item.quantity,
        total: itemTotal,
      });

      await db.insert(purchaseOrderItems).values({
        purchaseOrderId: purchaseId,
        productId: item.productId,
        purchasePrice: item.purchasePrice,
        quantity: item.quantity,
        totalAmount: itemTotal,
      });

      await db
        .update(productTable)
        .set({
          stock: sql`${productTable.stock} + ${item.quantity}`,
        })
        .where(eq(productTable.id, item.productId));
    }

    return {
      success: true,
      id: purchaseId,
      purchaseDate,
      totalAmount,
      items: purchaseItems,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to create purchase order.",
    };
  }
}
