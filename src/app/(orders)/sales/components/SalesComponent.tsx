"use client";

import { Category } from "@/types/Category";
import { GroupedSales } from "@/types/Sales";
import { User } from "@/types";
import { Product } from "@/types/Product";
import { useEffect, useRef, useState } from "react";
import SalesModal from "./SalesModal";
import Toast from "@/app/components/Toast";
import AllSales from "./AllSales";
import { Download, Plus } from "lucide-react";
import * as XLSX from "xlsx";
import SearchBox from "@/app/components/SearchBox";
import InfiniteScroll from "react-infinite-scroll-component";

type Props = {
  role: string;
  initialSales: GroupedSales[];
  users: User[];
  products: Product[];
  categories: Category[];
  nextCursor: number | null;
  hasMore: boolean;
};

export default function SalesComponent({
  role,
  initialSales,
  nextCursor,
  hasMore,
  users,
  products,
  categories,
}: Props) {
  const [open, setOpen] = useState(false);
  const [allSales, setAllSales] = useState<GroupedSales[]>(initialSales);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [cursor, setCursor] = useState(nextCursor);
  const [hasmore, setHasMore] = useState(hasMore);
  const [loading, setLoading] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const exportToExcel = () => {
    // 1. Convert JSON data into a worksheet object
    const worksheet = XLSX.utils.json_to_sheet(
      allSales.map((sale) => {
        return {
          salesId: sale.sales_orders.id,
          userId: sale.sales_orders.userId,
          salesDate: sale.sales_orders.saleDate,
          totalAmount: sale.sales_orders.totalAmount,
          userName: sale.users?.name,
          salesProductName: [
            ...sale.items.map((item) => item.products?.name),
          ].join(", "),
          salesProductPrice: [
            ...sale.items.map((item) => item.products?.sellingPrice),
          ].join(", "),
        };
      }),
    );

    // 2. Create a fresh workbook instance
    const workbook = XLSX.utils.book_new();

    // 3. Append the worksheet with a specific sheet name
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // 4. Generate buffer and trigger local download
    XLSX.writeFile(workbook, "sales_history.xlsx");
  };

  const loadMore = async () => {
    if (!hasmore || loading || cursor === null) return;

    const params = new URLSearchParams();

    params.append("cursor", String(cursor));

    if (debouncedSearch) params.append("search", debouncedSearch);

    try {
      setLoading(true);

      const res = await fetch(`/api/sales?${params}`);
      const data = await res.json();

      setAllSales((prev) => [...prev, ...data.sales]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.append("search", debouncedSearch);

    try {
      setLoading(true);
      const res = await fetch(`/api/sales?${params}`);
      const data = await res.json();

      setAllSales(data.sales);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
    }
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    fetchSales();
  }, [debouncedSearch]);

  return (
    <div className="py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Sales Orders
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Manage all outgoing stock orders and deliveries
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <SearchBox setSearch={setSearch} search={search} />
          {role == "ADMIN" && (
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
            >
              <Download size={16} absoluteStrokeWidth />
              Export to Excel
            </button>
          )}
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
          >
            <Plus size={16} absoluteStrokeWidth />
            Create Sales Order
          </button>
        </div>
      </div>

      <InfiniteScroll
        dataLength={allSales.length}
        next={loadMore}
        hasMore={hasmore}
        loader={
          <p className="py-4 text-center text-slate-500">
            Loading more sales...
          </p>
        }
        endMessage={
          <p className="py-4 text-center text-slate-500">
            You've reached the end.
          </p>
        }
      >
        <AllSales allSales={allSales} />
      </InfiniteScroll>

      <SalesModal
      fetchSales={fetchSales}
        products={products}
        users={users}
        categories={categories}
        open={open}
        onClose={onClose}
      />
      <Toast />
    </div>
  );
}
