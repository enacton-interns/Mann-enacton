import { Category } from "@/types";
import { Dispatch, SetStateAction } from "react";

type Props = {
    categories : Category[];
    selectedCategory : {id:number; name:string;} | null
    setSelectedCategory: React.Dispatch<SetStateAction<Category | null>>
}

export default function CategoryFilter({categories, selectedCategory, setSelectedCategory}:Props) {
  return (
    <select
      className="h-11 min-w-48 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 outline-none hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:focus:border-indigo-400"
      value={selectedCategory?.id ?? -1}
      onChange={(e) => {
        const id = Number(e.target.value);

        setSelectedCategory(
          id === -1
            ? { id: -1, name: "All" }
            : (categories.find((category) => category.id === id) ?? null),
        );
      }}
    >
      <option className="text-black " value={-1}>
        All Categories
      </option>

      {categories.map((category) => (
        <option
          className="text-black hover:bg-gray-500"
          key={category.id}
          value={category.id}
        >
          {category.name}
        </option>
      ))}
    </select>
  );
}