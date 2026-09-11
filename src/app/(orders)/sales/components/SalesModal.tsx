import { User, Product, Category } from "@/types";
import { AnimatePresence, motion } from "motion/react";
import SalesItemRow from "./SalesItemRow";
import { createSalesOrder } from "../_actions/sales";
import toast from "react-hot-toast";

type Props = {
  products: Product[];
  users: User[];
  categories: Category[];
  open: boolean;
  onClose: () => void;
  fetchSales: () => void;
};

export default function SalesModal({
  users,
  products,
  categories,
  open,
  onClose,
  fetchSales
}: Props) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.loading("Creating sales order...");

    const formData = new FormData(e.currentTarget);
    
    const sale = await createSalesOrder(formData);
    fetchSales()
    
    toast.dismiss();
    toast.success("Sales order created successfully");
    onClose();
  };

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
                  New Sales Order
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Create a new sales order.
                </p>
              </div>
 
              <form onSubmit={handleSubmit} className="p-4 md:p-7 flex flex-col gap-4 md:gap-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      Sales Date
                    </label>
                    <input
                      type="date"
                      name="salesdate"
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      Seller
                    </label>
                    <select
                      name="userid"
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    >
                      <option value="">Select Seller</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <SalesItemRow products={products} categories={categories} />

                <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                  >
                    Cancel Order
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
                  >
                    Create Sales Order
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
