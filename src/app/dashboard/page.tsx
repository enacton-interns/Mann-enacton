import { db } from "@/db/drizzle";
import {
  productTable,
  supplierTable,
  categoryTable,
  purchaseOrders,
  salesOrders,
  usersTable,
} from "@/db/schema";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { count, lte, desc, eq } from "drizzle-orm";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BadgeIndianRupee,
  CheckCircle,
  ListSortAscending,
  Package,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const cookie = await cookies();
  const token = cookie.get("session")?.value;
  let role = "STAFF";

  try {
    const payload = await verifyToken(token!);
    role = payload.role;
  } catch {}

  const [productCount] = await db.select({ value: count() }).from(productTable);
  const [supplierCount] = await db
    .select({ value: count() })
    .from(supplierTable);
  const [categoryCount] = await db
    .select({ value: count() })
    .from(categoryTable);

  // Low stock products: stock <= minimumStock
  const lowStockProducts = await db
    .select({
      id: productTable.id,
      name: productTable.name,
      stock: productTable.stock,
      minimumStock: productTable.minimumStock,
    })
    .from(productTable)
    .where(lte(productTable.stock, productTable.minimumStock))
    .orderBy(productTable.stock)
    .limit(10);

  // Recent purchases (last 5)
  const recentPurchases = await db
    .select({
      id: purchaseOrders.id,
      date: purchaseOrders.purchaseDate,
      totalAmount: purchaseOrders.totalAmount,
      supplierName: supplierTable.name,
    })
    .from(purchaseOrders)
    .leftJoin(supplierTable, eq(purchaseOrders.supplierId, supplierTable.id))
    .orderBy(desc(purchaseOrders.id))
    .limit(5);

  // Recent sales (last 5)
  const recentSales = await db
    .select({
      id: salesOrders.id,
      date: salesOrders.saleDate,
      totalAmount: salesOrders.totalAmount,
      userName: usersTable.name,
    })
    .from(salesOrders)
    .leftJoin(usersTable, eq(salesOrders.userId, usersTable.id))
    .orderBy(desc(salesOrders.id))
    .limit(5);

  // Merge and sort recent activity by date desc
  type ActivityItem = {
    type: "purchase" | "sale";
    id: number;
    date: string;
    totalAmount: number;
    entityName: string;
  };

  const recentActivity: ActivityItem[] = [
    ...recentPurchases.map((p) => ({
      type: "purchase" as const,
      id: p.id,
      date: p.date,
      totalAmount: p.totalAmount,
      entityName: p.supplierName || "Unknown Supplier",
    })),
    ...recentSales.map((s) => ({
      type: "sale" as const,
      id: s.id,
      date: s.date,
      totalAmount: s.totalAmount,
      entityName: s.userName || "Unknown User",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  return (
    <div className="py-2">
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
          Welcome back!
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {/* Products */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:-translate-y-0.5">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-5 bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Package size={16} absoluteStrokeWidth />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-none">
            {productCount.value}
          </div>
          <div className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5 md:mt-2">
            Total Products
          </div>
        </div>

        {/* Suppliers */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:-translate-y-0.5">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-5 bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400">
            <Users size={16} absoluteStrokeWidth />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-none">
            {supplierCount.value}
          </div>
          <div className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5 md:mt-2">
            Total Suppliers
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:-translate-y-0.5">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-5 bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400">
            <ListSortAscending size={16} absoluteStrokeWidth />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-none">
            {categoryCount.value}
          </div>
          <div className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5 md:mt-2">
            Categories
          </div>
        </div>

        {/* Role */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:-translate-y-0.5">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-5 bg-purple-50 text-purple-500 dark:bg-purple-500/10 dark:text-purple-400">
            <ShieldCheck size={16} absoluteStrokeWidth />
          </div>
          <div className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-normal h-7 md:h-7.5 flex items-center">
            {role}
          </div>
          <div className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5 md:mt-2">
            Your Role
          </div>
        </div>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle
                  size={15}
                  absoluteStrokeWidth
                  className="text-amber-500 dark:text-amber-400"
                />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Low Stock Alerts
              </h2>
            </div>
            {lowStockProducts.length > 0 && (
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full">
                {lowStockProducts.length} item{lowStockProducts.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="p-4 md:p-6">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle
                  size={28}
                  absoluteStrokeWidth
                  className="text-emerald-400 mx-auto mb-2"
                />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  All clear! No products are low on stock.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {lowStockProducts.map((product) => {
                  const isOutOfStock = product.stock <= 0;
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isOutOfStock
                              ? "bg-red-500"
                              : "bg-amber-500"
                          }`}
                        />
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {product.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            isOutOfStock
                              ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                              : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                          }`}
                        >
                          {isOutOfStock ? "Out" : "Low"}
                        </span>
                        <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
                          {product.stock}/{product.minimumStock}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <BadgeIndianRupee
                size={15}
                absoluteStrokeWidth
                className="text-indigo-500 dark:text-indigo-400"
              />
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              Recent Activity
            </h2>
          </div>

          <div className="p-4 md:p-6">
            {recentActivity.length === 0 ? (
              <div className="text-center py-6">
                <Package
                  size={28}
                  absoluteStrokeWidth
                  className="text-slate-300 dark:text-slate-600 mx-auto mb-2"
                />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  No recent activity yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {recentActivity.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          item.type === "sale"
                            ? "bg-emerald-50 dark:bg-emerald-500/10"
                            : "bg-blue-50 dark:bg-blue-500/10"
                        }`}
                      >
                        {item.type === "sale" ? (
                          <ArrowUpRight
                            size={14}
                            absoluteStrokeWidth
                            className="text-emerald-500 dark:text-emerald-400"
                          />
                        ) : (
                          <ArrowDownRight
                            size={14}
                            absoluteStrokeWidth
                            className="text-blue-500 dark:text-blue-400"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                          {item.type === "sale" ? "Sale" : "Purchase"} #{item.id}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {item.entityName} · {item.date}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-bold tabular-nums shrink-0 ml-3 ${
                        item.type === "sale"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {item.type === "sale" ? "+" : "-"}₹
                      {Number(item.totalAmount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}