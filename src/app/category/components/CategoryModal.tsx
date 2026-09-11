"use client";

import { AnimatePresence, motion } from "motion/react";
import { addCategory, updateCategory } from "../_actions/category";
import { useEffect, useState } from "react";
import { Category } from "@/types/Category";
import toast from "react-hot-toast";
import Toast from "@/app/components/Toast";

type Props = {
  open: boolean;
  onClose: () => void;
  category: Category | null;
};

export default function CategoryModal({ open, onClose, category }: Props) {
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [name, setName] = useState("")
  const isEditing = category !== null

  useEffect(()=>{
    if(category){
      setName(category.name)
    } else{
      setName("")
    }
  },[category, open])

  function handleClose(){
    onClose()
    setErrors({})
    setName("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    const formData = new FormData(e.currentTarget)
    if(isEditing){
      formData.append('id', category.id.toString())
    }

    if(isEditing){
      toast.loading("Editing category...")
      const result = await updateCategory(formData)

      if(!result?.success){

        setErrors(result?.errors ?? {});
        toast.dismiss();
        toast.error(result?.message);
        return

      } else {
        setErrors({})
        toast.dismiss()
        toast.success(result?.message)
      }

    } else {
      toast.loading("Adding category...")
      const result = await addCategory(formData)

      if(!result?.success){
        setErrors(result?.errors ?? {});
        toast.dismiss();
        toast.error(result?.message)
        return
      } else {
        setErrors({})
        toast.dismiss();
        toast.success(result?.message)
      }
    }

    onClose()
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
            className="fixed inset-0 z-60 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="w-full max-w-[95vw] md:max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden my-4 md:my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 md:px-7 py-4 md:py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                  {isEditing ? "Edit Category" : "Add Category"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isEditing
                    ? "Update category information."
                    : "Create a new category."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-4 md:p-7 flex flex-col gap-4 md:gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                    Category Name
                  </label>
                  <input
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="Enter category name"
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {
                    errors?.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name}
                      </p>
                    )
                  }
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
                  >
                    {isEditing ? "Edit Category" : "Add Category"}
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
