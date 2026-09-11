"use client";

import { Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import Sidebar from "@/components/layout/SideBar";

export default function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/95 px-4 backdrop-blur dark:border-white/10 dark:bg-[#07090c]/95 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
            <Sparkles size={16} />
          </div>

          <span className="font-semibold text-black dark:text-white">
            ContentForge
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <Menu size={20} />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Dark overlay */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />

          {/* Drawer */}
          <div className="relative h-full w-[288px]">
            <Sidebar
              mobile
              onNavigate={() => setOpen(false)}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
