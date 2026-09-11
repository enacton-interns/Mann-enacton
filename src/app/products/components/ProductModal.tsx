"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Product } from "@/types/Product";
import { Supplier } from "@/types/Supplier";
import { Category } from "@/types/Category";
import { addProduct, updateProduct } from "../_actions/product";
import toast from "react-hot-toast";

export default function ProductModal({
  open,
  product,
  onClose,
  suppliers,
  categories,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  suppliers: Supplier[];
  categories: Category[];
}) {
  const isEditing = product !== null;
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [productDescription, setProductDescription] = useState<Product | null>({
    id: 0,
    name: "",
    description: "",
    purchasePrice: 0,
    sellingPrice: 0,
    stock: 0,
    minimumStock: 0,
    categoryId: 0,
    supplierId: 0,
  });

  useEffect(() => {
    if (product) {
      setProductDescription(product);
    } else {
      setProductDescription({
        id: 0,
        name: "",
        description: "",
        purchasePrice: 0,
        sellingPrice: 0,
        stock: 0,
        minimumStock: 0,
        categoryId: 0,
        supplierId: 0,
      });
    }
  }, [product, open]);

  function clearForm() {
    setProductDescription({
      id: 0,
      name: "",
      description: "",
      purchasePrice: 0,
      sellingPrice: 0,
      stock: 0,
      minimumStock: 0,
      categoryId: 0,
      supplierId: 0,
    });
    setErrors({});
    onClose();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrors({});

    const formData = new FormData(e.currentTarget);

    if (isEditing) {
      formData.append("id", String(product?.id));
    }

    const result = isEditing
      ? await updateProduct(formData)
      : await addProduct(formData);

    if (!result.success) {
      setErrors(result.errors ?? {});

      if (!result.errors) {
        toast.error(result.message);
      }

      return;
    }

    setErrors({});
    toast.success(result.message);
    onClose();
  }

  return (
    <>
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
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[95vw] md:max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden my-4 md:my-8"
              >
                <div className="px-4 md:px-7 py-4 md:py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                    {isEditing ? "Edit Product" : "Add Product"}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {isEditing
                      ? "Update product information."
                      : "Create a new product."}
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="p-4 md:p-7 flex flex-col gap-4 md:gap-5"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      Product Name
                    </label>
                    <input
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="ABC Product"
                      name="name"
                      value={productDescription?.name}
                      onChange={(e) =>
                        setProductDescription((prev) => ({
                          ...prev!,
                          name: e.target.value,
                        }))
                      }
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name[0]}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                      placeholder="Enter product description"
                      name="description"
                      value={productDescription?.description as string}
                      onChange={(e) =>
                        setProductDescription((prev) => ({
                          ...prev!,
                          description: e.target.value,
                        }))
                      }
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.description[0]}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                        Purchase Price
                      </label>
                      <input
                        type="number"
                        step="1"
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="0.00"
                        name="purchasePrice"
                        value={productDescription?.purchasePrice}
                        onChange={(e) =>
                          setProductDescription((prev) => ({
                            ...prev!,
                            purchasePrice: Number(e.target.value),
                          }))
                        }
                      />
                      {errors.purchasePrice && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.purchasePrice[0]}
                        </p>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                        Selling Price
                      </label>
                      <input
                        type="number"
                        step="1"
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="0.00"
                        name="sellingPrice"
                        value={productDescription?.sellingPrice}
                        onChange={(e) =>
                          setProductDescription((prev) => ({
                            ...prev!,
                            sellingPrice: Number(e.target.value),
                          }))
                        }
                      />
                      {errors.sellingPrice && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.sellingPrice[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                        Stock
                      </label>
                      <input
                        type="number"
                        step="1"
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="0.00"
                        name="stock"
                        value={productDescription?.stock}
                        onChange={(e) =>
                          setProductDescription((prev) => ({
                            ...prev!,
                            stock: Number(e.target.value),
                          }))
                        }
                      />
                      {errors.stock && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.stock[0]}
                        </p>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                        Minimum Stock
                      </label>
                      <input
                        type="number"
                        step="1"
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="0.00"
                        name="minimumStock"
                        value={productDescription?.minimumStock}
                        onChange={(e) =>
                          setProductDescription((prev) => ({
                            ...prev!,
                            minimumStock: Number(e.target.value),
                          }))
                        }
                      />
                      {errors.minimumStock && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.minimumStock[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      Category
                    </label>
                    <select
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      name="categoryId"
                      value={productDescription?.categoryId || 1}
                      onChange={(e) =>
                        setProductDescription((prev) => ({
                          ...prev!,
                          categoryId: Number(e.target.value),
                        }))
                      }
                    >
                      {categories.map((category: Category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.categoryId[0]}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      Supplier
                    </label>
                    <select
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      name="supplierId"
                      value={productDescription?.supplierId || 1}
                      onChange={(e) =>
                        setProductDescription((prev) => ({
                          ...prev!,
                          supplierId: Number(e.target.value),
                        }))
                      }
                    >
                      {suppliers.map((supplier: Supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                    {errors.supplierId && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.supplierId[0]}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={clearForm}
                      className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
                    >
                      {isEditing ? "Update Product" : "Add Product"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
