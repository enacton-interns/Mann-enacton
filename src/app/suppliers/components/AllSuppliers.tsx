"use client";
import { Supplier } from "@/types/Supplier";
import { deleteSupplier } from "../_actions/supplier";
import { Edit, Mail, MapPinHouse, Phone, Trash, Users } from "lucide-react";

type Props = {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
};
export default function AllSuppliers({ suppliers, onEdit }: Props) {
  if (suppliers.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400">
        <div className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700">
          <Users size={48} absoluteStrokeWidth />
        </div>
        No suppliers found. Add your first supplier to get started.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {suppliers.map((supplier) => (
        <div
          key={supplier.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:-translate-y-0.5 gap-4"
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
              {supplier.name}
            </h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail size={16} absoluteStrokeWidth />
                {supplier.email || "Not provided"}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={16} absoluteStrokeWidth />
                {supplier.phone || "Not provided"}
              </span>
              {supplier.address && (
                <span className="flex items-center gap-1.5 mt-1 w-full">
                  <MapPinHouse size={16} absoluteStrokeWidth />
                  {supplier.address}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onEdit(supplier)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md transition-colors"
            >
              <Edit size={16} absoluteStrokeWidth/>
            </button>

            <form action={() => deleteSupplier(supplier.id)}>
              <button className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-red-200 dark:border-red-900/30 rounded-md transition-colors">
                <Trash size={16} absoluteStrokeWidth/>
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
