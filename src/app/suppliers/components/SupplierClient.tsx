"use client"

import { useState } from "react";
import { Supplier } from "@/types/Supplier";
import AllSuppliers from "./AllSuppliers";
import SupplierModal from "./SupplierModal";
import Toast from "@/app/components/Toast";
import { Plus } from "lucide-react";

export default function SupplierClient({suppliers}:{suppliers : Supplier[]}){
    const [open, setOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

    return (
      <div className="py-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Suppliers</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Manage your supplier network</p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
            onClick={() => {
              setEditingSupplier(null);
              setOpen(true);
            }}
          >
            <Plus size={16}  absoluteStrokeWidth/>
            Add Supplier
          </button>
        </div>

        <AllSuppliers
          suppliers={suppliers}
          onEdit={(supplier) => {
            setEditingSupplier(supplier);
            setOpen(true);
          }}
        />

        <SupplierModal
          open={open}
          supplier={editingSupplier}
          onClose={() => setOpen(false)}
        />
        <Toast />
      </div>
    );
}