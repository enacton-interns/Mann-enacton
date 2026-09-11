import { db } from "@/db/drizzle";
import {
  productTable,
  salesOrderItems,
  salesOrders,
  usersTable,
} from "@/db/schema";
import { and, desc, eq, exists, lt, ilike, inArray, or } from "drizzle-orm";
import groupSales from "./groupSales";

const PAGE_SIZE = 15;

type GetSalesOptions = {
  cursor?: number;
  search?: string;
};

export async function getSales({ cursor, search }: GetSalesOptions) {

  const conditions = [];
  if (cursor) {
    conditions.push(lt(salesOrders.id, cursor));
  }

  if (search?.trim()) {
    conditions.push(
      or(
        exists(
          db
            .select({ id: salesOrderItems.id })
            .from(salesOrderItems)
            .innerJoin(
              productTable,
              eq(productTable.id, salesOrderItems.productId),
            )
            .where(
              and(
                eq(salesOrderItems.salesOrderId, salesOrders.id),
                ilike(productTable.name, `%${search}%`),
              ),
            ),
        ),
        exists(
          db
            .select({ id: usersTable.id })
            .from(usersTable)
            .where(
              and(
                eq(usersTable.id, salesOrders.userId),
                ilike(usersTable.name, `%${search}%`),
              ),
            ),
        ),
      ),
    );
  }

  const paginatedOrders = db.$with("paginated_orders").as(
    db
      .select({
        id: salesOrders.id,
      })
      .from(salesOrders)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(salesOrders.id))
      .limit(PAGE_SIZE + 1),
  );

  const ids = await db.with(paginatedOrders).select().from(paginatedOrders);
  const hasMore = ids.length > PAGE_SIZE;
  const pageIds = hasMore ? ids.slice(0, PAGE_SIZE) : ids;
  const nextCursor = hasMore ? pageIds[pageIds.length - 1].id : null;

  if (pageIds.length === 0) {
    return {
      sales: [],
      nextCursor: null,
      hasMore: false,
    };
  }

  const sales = await db
    .select()
    .from(salesOrders)
    .innerJoin(
      salesOrderItems,
      eq(salesOrders.id, salesOrderItems.salesOrderId),
    )
    .leftJoin(usersTable, eq(salesOrders.userId, usersTable.id))
    .leftJoin(productTable, eq(salesOrderItems.productId, productTable.id))
    .where(
      inArray(
        salesOrders.id,
        pageIds.map((x) => x.id),
      ),
    )
    .orderBy(desc(salesOrders.id));

  return {
    sales: groupSales(sales),
    nextCursor,
    hasMore,
  };
}
