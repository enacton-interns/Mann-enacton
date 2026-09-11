"use client";
import { GroupedPurchase } from "@/types/Purchase";
import { useEffect, useRef, useState } from "react";
import AllPurchases from "./AllPurchases";
import Toast from "@/app/components/Toast";
import { Supplier, Product, Category } from "@/types";
import PurchaseModal from "./PurchaseModal";
import * as XLSX from "xlsx";
import { Download, Plus } from "lucide-react";
import SupplierFilter from "@/app/components/SupplierFilter";
import SearchBox from "@/app/components/SearchBox";
import InfiniteScroll from "react-infinite-scroll-component";

type Props = {
  initialPurchases: GroupedPurchase[];
  nextCursor: number | null;
  hasMore: boolean;
  role: string;
  suppliers: Supplier[];
  products: Product[];
  categories: Category[];
};

export default function PurchasesComponent({
  role,
  initialPurchases,
  hasMore,
  nextCursor,
  suppliers,
  products,
  categories,
}: Props) {
  const [open, setOpen] = useState(false);
  const [allPurchases, setAllPurchases] =
    useState<GroupedPurchase[]>(initialPurchases);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const [hasmore, setHasMore] = useState(hasMore);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [cursor, setCursor] = useState(nextCursor);
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
      allPurchases.map((purchase) => {
        return {
          purchaseId: purchase.purchase_orders.id,
          supplierId: purchase.purchase_orders.supplierId,
          purchaseDate: purchase.purchase_orders.purchaseDate,
          totalAmount: purchase.purchase_orders.totalAmount,
          supplierName: purchase.suppliers?.name,
          purchaseProductName: [
            ...purchase.items.map((item) => item.products?.name),
          ].join(", "),
          purchaseProductPrice: [
            ...purchase.items.map((item) => item.products?.purchasePrice),
          ].join(", "),
        };
      }),
    );

    // 2. Create a fresh workbook instance
    const workbook = XLSX.utils.book_new();

    // 3. Append the worksheet with a specific sheet name
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // 4. Generate buffer and trigger local download
    XLSX.writeFile(workbook, "purchase_history.xlsx");
  };

  const loadMore = async () => {
    if (!hasmore || cursor == null) return;

    const params = new URLSearchParams();

    params.append("cursor", String(cursor));

    if (debouncedSearch) params.append("search", debouncedSearch);

    if (selectedSupplier?.id !== -1)
      params.append("supplier", String(selectedSupplier?.id));

    try {
      setLoading(true);

      const res = await fetch(`/api/purchases?${params}`);
      const data = await res.json();

      setAllPurchases((prev) => [...prev, ...data.purchases]);

      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchases = async () => {

    const params = new URLSearchParams();
    if (debouncedSearch) params.append("search", debouncedSearch);

    if (selectedSupplier?.id !== -1)
      params.append("supplier", String(selectedSupplier?.id));
    
    setLoading(true);

    try {
      const res = await fetch(`/api/purchases?${params}`);
      const data = await res.json();

      setAllPurchases(data.purchases);
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

    fetchPurchases();
  }, [debouncedSearch, selectedSupplier]);

  return (
    <div className="py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Purchase Orders
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Manage all incoming stock orders and deliveries
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <SearchBox search={search} setSearch={setSearch} />
          {role == "ADMIN" && (
            <>
              <SupplierFilter
                suppliers={suppliers}
                selectedSupplier={selectedSupplier}
                setSelectedSupplier={setSelectedSupplier}
              />
              <button
                onClick={exportToExcel}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
              >
                <Download size={16} absoluteStrokeWidth />
                Export to Excel
              </button>
            </>
          )}
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
          >
            <Plus size={16} absoluteStrokeWidth />
            Create Purchase Order
          </button>
        </div>
      </div>

      <InfiniteScroll
        dataLength={allPurchases.length}
        next={loadMore}
        hasMore={hasmore}
        loader={
          <p className="py-4 text-center text-slate-500">
            Loading more purchases...
          </p>
        }
        endMessage={
          <p className="py-4 text-center text-slate-500">
            You've reached the end.
          </p>
        }
      >
        <AllPurchases allPurchases={allPurchases} />
      </InfiniteScroll>

      <PurchaseModal
        fetchPurchases={fetchPurchases}
        products={products}
        suppliers={suppliers}
        categories={categories}
        open={open}
        onClose={onClose}
      />
      <Toast />
    </div>
  );
}
