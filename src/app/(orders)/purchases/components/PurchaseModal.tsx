"use client";
import { Product, Supplier, Category } from "@/types";
import PurchaseItemRow from "./PurchaseItemRow";
import { AnimatePresence, motion } from "motion/react";
import { createPurchaseOrder } from "../_actions/purchases";
import toast from "react-hot-toast";
import { useState } from "react";

type Props = {
  products: Product[];
  suppliers: Supplier[];
  categories: Category[];
  open: boolean;
  onClose: () => void;
  fetchPurchases: () => void;
};

export default function PurchaseModal({
  products,
  suppliers,
  categories,
  open,
  onClose,
  fetchPurchases
}: Props) {
  const [errors, setErrors] = useState<Record<string, string[]>>();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.loading("Creating Purchase order");
    setErrors({});

    const formData = new FormData(e.currentTarget);

    const purchase = await createPurchaseOrder(formData);

    if (!purchase.success) {
      setErrors(purchase.errors);

      toast.dismiss();
      toast.error("Failed to create purchase order");
      return;
    } else {
      setErrors({});
      toast.dismiss();
      toast.success("Purchase order created successfully");
      fetchPurchases();
      onClose();
    }
  };
  function closeModal() {
    setErrors({});
    onClose();
  }
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-60 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="w-full max-w-[95vw] md:max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden my-4 md:my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 md:px-7 py-4 md:py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                  New Purchase Order
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Create a new purchase order from suppliers.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-4 md:p-7 flex flex-col gap-4 md:gap-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      name="purchasedate"
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                    {errors?.purchaseDate?.map((err, i) => (
                      <p
                        key={i}
                        className="text-xs text-red-500 dark:text-red-400"
                      >
                        {err}
                      </p>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      Supplier
                    </label>
                    <select
                      name="supplierid"
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                    {errors?.supplierId?.map((err, i) => (
                      <p
                        key={i}
                        className="text-xs text-red-500 dark:text-red-400"
                      >
                        {err}
                      </p>
                    ))}
                  </div>
                </div>

                <PurchaseItemRow products={products} categories={categories} />

                <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                  >
                    Cancel Order
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
                  >
                    Create Purchase Order
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
