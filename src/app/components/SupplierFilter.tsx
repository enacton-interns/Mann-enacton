import { Supplier } from "@/types";
import { SetStateAction } from "react";

type Props = {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  setSelectedSupplier: React.Dispatch<SetStateAction<Supplier | null>>;
};

export default function SupplierFilter({
  suppliers,
  selectedSupplier,
  setSelectedSupplier,
}: Props) {
  return (
    <select
      value={selectedSupplier?.id ?? -1}
      onChange={(e) => {
        const id = Number(e.target.value);

        setSelectedSupplier(
          id === -1
            ? { id: -1, name: "All" }
            : (suppliers.find((supplier) => supplier.id === id) ?? null),
        );
      }}
      className="h-11 min-w-48 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 outline-none hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:focus:border-indigo-400"
    >
      <option value={-1}>All Suppliers</option>

      {suppliers.map((supplier) => (
        <option key={supplier.id} value={supplier.id}>
          {supplier.name}
        </option>
      ))}
    </select>
  );
}
