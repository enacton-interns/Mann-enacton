import { db } from "@/db/drizzle";
import {
  productTable,
  purchaseOrderItems,
  purchaseOrders,
  supplierTable,
} from "@/db/schema";
import { and, desc, eq, ilike, inArray, lt, exists } from "drizzle-orm";
import groupPurchases from "./groupPurchases";

const PAGE_SIZE = 10;

type GetPurchasesOptions = {
  cursor?: number;
  search?: string;
  supplierId?: number;
};

export async function getPurchases({
  cursor, search, supplierId
}: GetPurchasesOptions) {

  const conditions = [];

  if (cursor) {
    conditions.push(lt(purchaseOrders.id, cursor));
  }

  if (supplierId) {
    conditions.push(eq(purchaseOrders.supplierId, supplierId));
  }
  if(search){
    if (search!.trim()) {
      conditions.push(
        exists(
          db
            .select({ id: purchaseOrderItems.id })
            .from(purchaseOrderItems)
            .innerJoin(
              productTable,
              eq(productTable.id, purchaseOrderItems.productId),
            )
            .where(
              and(
                eq(purchaseOrderItems.purchaseOrderId, purchaseOrders.id),
                ilike(productTable.name, `%${search}%`),
              ),
            ),
        ),
      );
    }
  }

  const paginatedOrders = db.$with("paginated_orders").as(
    db
      .select({
        id: purchaseOrders.id,
      })
      .from(purchaseOrders)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(purchaseOrders.id))
      .limit(PAGE_SIZE + 1),
  );

  const ids = await db.with(paginatedOrders).select().from(paginatedOrders);
  const hasMore = ids.length > PAGE_SIZE;
  const pageIds = hasMore ? ids.slice(0, PAGE_SIZE) : ids;
  const nextCursor = hasMore ? pageIds[pageIds.length - 1].id : null;

  if (pageIds.length === 0) {
    return {
      purchases: [],
      nextCursor: null,
      hasMore: false,
    };
  }

  const purchases = await db
    .select()
    .from(purchaseOrders)
    .innerJoin(
      purchaseOrderItems,
      eq(purchaseOrders.id, purchaseOrderItems.purchaseOrderId),
    )
    .leftJoin(supplierTable, eq(purchaseOrders.supplierId, supplierTable.id))
    .leftJoin(productTable, eq(purchaseOrderItems.productId, productTable.id))
    .where(
      inArray(
        purchaseOrders.id,
        pageIds.map((x) => x.id),
      ),
    )
    .orderBy(desc(purchaseOrders.id));

  return {
    purchases : groupPurchases(purchases),
    nextCursor,
    hasMore,
  };
}
