"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Supplier } from "@/types/Supplier";
import { createSupplier, updateSupplier } from "../_actions/supplier";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  supplier: Supplier | null;
  onClose: () => void;
};

export default function SupplierModal({ open, supplier, onClose }: Props) {
  const isEditing = supplier !== null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (supplier) {
      setName(supplier.name);
      setEmail(supplier.email!);
      setPhone(supplier.phone ?? "");
      setAddress(supplier.address ?? "");
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
    }
  }, [supplier, open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (isEditing) {
      toast.loading("Editing supplier...")
      formData.append("id", String(supplier?.id));
      await updateSupplier(formData);
      toast.dismiss();
      toast.success("Supplier edited successfully")
    } else {
      toast.loading("Adding supplier...")
      await createSupplier(formData);
      toast.dismiss();
      toast.success("Supplier added successfully")
    }

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
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[95vw] md:max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden my-4 md:my-8"
            >
              <div className="px-4 md:px-7 py-4 md:py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                  {isEditing ? "Edit Supplier" : "Add Supplier"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isEditing
                    ? "Update supplier information."
                    : "Create a new supplier."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-4 md:p-7 flex flex-col gap-4 md:gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Supplier Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="ABC Suppliers"
                    name="name"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="supplier@example.com"
                    name="email"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Phone</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="+1 234 567 890"
                    name="phone"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Address</label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                    placeholder="Enter supplier address"
                    name="address"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
                  >
                    {isEditing ? "Update Supplier" : "Add Supplier"}
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
