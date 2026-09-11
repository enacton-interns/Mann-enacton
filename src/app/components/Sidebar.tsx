"use client";

import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { handleLogout } from "../(auth)/_actions/auth";
import {
  BadgeIndianRupee,
  ChevronLeft,
  LayoutDashboard,
  ListSortAscending,
  LogOut,
  Moon,
  Package,
  PackageSearch,
  ShoppingBag,
  Sun,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

type SidebarProps = {
  role: string;
  userName: string;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={16} absoluteStrokeWidth />,
  },
];

const adminItems = [
  {
    label: "Products",
    href: "/products",
    icon: <PackageSearch size={16} absoluteStrokeWidth />,
  },
  {
    label: "Categories",
    href: "/category",
    icon: <ListSortAscending size={16} absoluteStrokeWidth />,
  },
  {
    label: "Suppliers",
    href: "/suppliers",
    icon: <Users size={16} absoluteStrokeWidth />,
  },
];

const operationItems = [
  {
    label: "Purchases",
    href: "/purchases",
    icon: <ShoppingBag size={16} absoluteStrokeWidth />,
  },
  {
    label: "Sales",
    href: "/sales",
    icon: <BadgeIndianRupee size={16} absoluteStrokeWidth />,
  },
];

export default function Sidebar({
  role,
  userName,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (
      storedTheme === "dark" ||
      (!storedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const isActive = (path: string) => pathname === path;

  const logout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await handleLogout();
    
    if (result.success) {
      toast.success(result.message);
      redirect("/signin");
    } else {
      toast.error(result.message);
    }
  };

  // Close mobile sidebar on link click
  const handleNavClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const renderNavLink = (item: { label: string; href: string; icon: React.ReactNode }) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={handleNavClick}
      className={`flex items-center ${isCollapsed ? "justify-center px-0 md:justify-center md:px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-sm font-medium transition-all relative ${isActive(item.href) ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"}`}
      title={isCollapsed ? item.label : undefined}
    >
      {isActive(item.href) && (
        <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 dark:bg-indigo-500 rounded-r-full" />
      )}
      <span
        className={`w-5 h-5 shrink-0 ${isActive(item.href) ? "opacity-100" : "opacity-70"}`}
      >
        {item.icon}
      </span>
      {!isCollapsed && <span className="truncate">{item.label}</span>}
      {/* On mobile, always show label regardless of collapse */}
      {isCollapsed && isMobileOpen && <span className="truncate md:hidden">{item.label}</span>}
    </Link>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50 shadow-xl transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"} ${isMobileOpen ? "translate-x-0" : "max-md:-translate-x-full"}`}
      >
        {/* Desktop collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:block absolute -right-3 top-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-600 dark:hover:border-indigo-400 transition-all duration-300 z-40 shadow-sm"
          title="Toggle Sidebar"
        >
          <ChevronLeft
            size={16}
            absoluteStrokeWidth
            className={`${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden absolute right-3 top-5 p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-50"
          title="Close Menu"
        >
          <X size={18} absoluteStrokeWidth />
        </button>

        {/* Brand */}
        <div
          className={`p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 ${isCollapsed ? "justify-center px-4" : ""}`}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <Package size={16} absoluteStrokeWidth />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
                InvenPro
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.15em] truncate">
                Inventory System
              </span>
            </div>
          )}
          {/* Show brand on mobile even when collapsed */}
          {isCollapsed && isMobileOpen && (
            <div className="flex flex-col overflow-hidden md:hidden">
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
                InvenPro
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.15em] truncate">
                Inventory System
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden px-3">
          {!isCollapsed && (
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-3 pt-4 pb-2">
              Overview
            </span>
          )}

          {navItems.map(renderNavLink)}

          {role === "ADMIN" && (
            <>
              {!isCollapsed && (
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-3 pt-4 pb-2">
                  Management
                </span>
              )}
              {isCollapsed && (
                <div className="h-4 border-b border-slate-200 dark:border-slate-800 mb-2 mx-2"></div>
              )}

              {adminItems.map(renderNavLink)}
            </>
          )}

          {!isCollapsed && (
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-3 pt-4 pb-2">
              Operations
            </span>
          )}
          {isCollapsed && (
            <div className="h-4 border-b border-slate-200 dark:border-slate-800 mb-2 mx-2"></div>
          )}

          {operationItems.map(renderNavLink)}
        </nav>

        {/* Profile */}
        <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
          <div
            className={`flex items-center ${isCollapsed ? "justify-center flex-col gap-3" : "gap-3"} p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800/50 transition-all`}
          >
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
              {role === "ADMIN" ? "A" : "S"}
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {role === "ADMIN" ? "Admin" : "Staff"} User
                </div>
                <div className="flex items-center mt-0.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      role === "ADMIN"
                        ? "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30"
                        : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30"
                    }`}
                  >
                    {role || "STAFF"}
                  </span>
                </div>
              </div>
            )}

            <div
              className={`flex items-center gap-1 ${isCollapsed ? "flex-col" : ""}`}
            >
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                title="Toggle Theme"
              >
                {theme === "light" ? (
                  <Moon size={16} absoluteStrokeWidth />
                ) : (
                  <Sun size={16} absoluteStrokeWidth />
                )}
              </button>
              <form onSubmit={logout} className={isCollapsed ? "w-full" : ""}>
                <button
                  type="submit"
                  className="w-full flex justify-center p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} absoluteStrokeWidth />
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
