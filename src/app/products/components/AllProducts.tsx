"use client";
import { Product } from "@/types/Product";
import { deleteProduct } from "../_actions/product";
import Link from "next/link";
import { Box, Edit, Trash } from "lucide-react";
import toast from "react-hot-toast";

const getStockStatus = (stock: number, minimumStock: number) => {
  if (stock <= 0)
    return {
      label: "Out of Stock",
      className:
        "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    };
  if (stock <= minimumStock)
    return {
      label: "Low Stock",
      className:
        "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    };
  return {
    label: "In Stock",
    className:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  };
};

export default function AllProducts({
  products,
  onEdit,
  role,
}: {
  products: Product[] | null;
  onEdit: (product: Product) => void;
  role: string;
}) {
  const handleEdit = (product: Product) => {
    onEdit(product);
  };

  const handleDelete = async (id:number) => {
    const res = await deleteProduct(id);
    
    if (res.success) {
      toast.success(res.message!);
    } else {
      toast.error(res.message!);
    }
  }

  if (products?.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400">
        <div className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700">
          <Box size={16} absoluteStrokeWidth />
        </div>
        No products found. Add your first product to get started.
      </div>
    );
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="flex flex-col gap-3 md:hidden">
        {products?.map((product) => {
          const stockStatus = getStockStatus(product.stock, product.minimumStock);
          return (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {product.description || "No description"}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${stockStatus.className}`}
                >
                  {stockStatus.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center mb-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg py-2 px-1">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">
                    Purchase
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                    ₹{product.purchasePrice.toFixed(2)}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg py-2 px-1">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">
                    Selling
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                    ₹{product.sellingPrice.toFixed(2)}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg py-2 px-1">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">
                    Stock
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                    {product.stock}
                  </div>
                </div>
              </div>

              {role === "ADMIN" && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit size={13} absoluteStrokeWidth />
                    Edit
                  </button>
                  <form onSubmit={() => handleDelete(product.id)} className="flex-1">
                    <button className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-red-200 dark:border-red-900/30 rounded-lg transition-colors">
                      <Trash size={13} absoluteStrokeWidth />
                      Delete
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  ID
                </th>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Name
                </th>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Description
                </th>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Purchase Price
                </th>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Selling Price
                </th>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Stock
                </th>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Status
                </th>
                {role === "ADMIN" && (
                  <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {products?.map((product) => {
                const stockStatus = getStockStatus(
                  product.stock,
                  product.minimumStock,
                );
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      <Link href={`/products/${product.id}`}>
                        #{product.id}
                      </Link>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                      <Link href={`/products/${product.id}`}>{product.name}</Link>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 max-w-50 truncate">
                      {product.description || "—"}
                    </td>
                    <td className="px-5 py-4 font-semibold tabular-nums text-slate-900 dark:text-white">
                      ₹{product.purchasePrice.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 font-semibold tabular-nums text-slate-900 dark:text-white">
                      ₹{product.sellingPrice.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-slate-900 dark:text-white">
                      {product.stock}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${stockStatus.className}`}
                      >
                        {stockStatus.label}
                      </span>
                    </td>
                    {role === "ADMIN" && (
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md transition-colors"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit size={16} absoluteStrokeWidth/>
                          </button>
                          <form onSubmit={() => handleDelete(product.id)}>
                            <button className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-red-200 dark:border-red-900/30 rounded-md transition-colors">
                              <Trash size={16} absoluteStrokeWidth />
                            </button>
                          </form>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
