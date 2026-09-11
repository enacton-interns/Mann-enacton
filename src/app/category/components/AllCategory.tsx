"use client";

import { Blocks, Edit, Trash } from "lucide-react";
import { deleteCategory } from "../_actions/category";
import { Category } from "@/types/Category";

function AllCategory({ categories, onEdit}: { categories: Category[]; onEdit: (category: Category) => void }) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400">
        <div className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700">
          <Blocks size={16} absoluteStrokeWidth />
        </div>
        No categories found. Add your first category to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {categories.map((item: Category) => {
        return (
          <div
            key={item.id}
            className="flex flex-col p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:-translate-y-0.5 gap-4"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                {item.name}
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Category ID: #{item.id}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-auto pt-2">
              <button onClick={() => onEdit(item)} className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md transition-colors">
                <Edit size={16} absoluteStrokeWidth/>
              </button>
              <button
                className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-red-200 dark:border-red-900/30 rounded-md transition-colors"
                onClick={() => deleteCategory(item.id)}
              >
                <Trash size={16} absoluteStrokeWidth />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AllCategory;
