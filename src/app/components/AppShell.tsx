"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Menu, Package } from "lucide-react";

type AppShellProps = {
  children: React.ReactNode;
  role: string;
  userName: string;
};

export default function AppShell({ children, role, userName }: AppShellProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/signin" || pathname === "/signup";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (isAuthPage) {
    return <main className="flex-1 flex flex-col min-h-screen">{children}</main>;
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      <Sidebar
        role={role}
        userName={userName}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Open Menu"
        >
          <Menu size={20} absoluteStrokeWidth />
        </button>
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
          <Package size={14} absoluteStrokeWidth />
        </div>
        <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          InvenPro
        </span>
      </div>

      <main className={`flex-1 p-4 md:p-8 min-h-screen w-full overflow-x-hidden transition-all duration-300 pt-18 md:pt-8 ${
        isCollapsed ? "md:ml-20" : "md:ml-64"
      }`}>
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
