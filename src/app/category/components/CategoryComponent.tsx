"use client";

import { useState } from "react";
import AllCategory from "./AllCategory";
import CategoryModal from "./CategoryModal";
import { Category } from "@/types/Category";
import Toast from "@/app/components/Toast";
import { Plus } from "lucide-react";

export default function CategoryComponent({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  return (
    <div className="py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Categories
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Organize your products by category
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
          onClick={() => {
            setOpen(true);
            setSelectedCategory(null);
          }}
        >
         <Plus size={16} absoluteStrokeWidth/>
          Add Category
        </button>
      </div>

      <AllCategory
        categories={categories}
        onEdit={(category) => {
          setSelectedCategory(category);
          setOpen(true);
        }}
      />

      <CategoryModal
        open={open}
        category={selectedCategory}
        onClose={() => setOpen(false)}
      />
    <Toast />
    </div>
  );
}
