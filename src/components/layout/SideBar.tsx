"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Database,
  Layers3,
  Sun,
  Moon,
  Settings,
  X,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Sources",
    href: "/sources",
    icon: Database,
  },
];

interface SidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
  onClose?: () => void;
}

export default function Sidebar({
  mobile = false,
  onNavigate,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <aside
      className={
        mobile
          ? "relative h-full w-[288px] bg-white dark:bg-[#0b0d10]"
          : "fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-zinc-200 bg-zinc-50 transition-colors lg:block dark:border-white/10 dark:bg-[#0b0d10]"
      }
    >
      <div className="flex h-full flex-col">
        {/* Header / Logo */}
        <div className="flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
              <Layers3 size={19} />
            </div>

            <div>
              <h1 className="font-semibold tracking-tight text-black dark:text-white">
                ContentForge
              </h1>

              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                AI Content Engine
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          {mobile && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-black dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Divider */}
        {mobile && (
          <div className="border-t border-zinc-200 dark:border-white/10" />
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                  active
                    ? "bg-black/5 text-black dark:bg-white/10 dark:text-white"
                    : "text-zinc-600 hover:bg-black/5 hover:text-black dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="space-y-1 border-t border-zinc-200 p-4 dark:border-white/10">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-zinc-600 transition hover:bg-black/5 hover:text-black dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}

            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          <Link
            href="/settings"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-zinc-600 transition hover:bg-black/5 hover:text-black dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
