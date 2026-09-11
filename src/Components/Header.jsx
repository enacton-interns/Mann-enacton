import { useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/JournalMoodSlice";
import { FaMoon } from "react-icons/fa6";
import { IoSunny } from "react-icons/io5";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { TbBrain } from "react-icons/tb";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/journals", label: "Journals" },
  { to: "/moods", label: "Moods" },
  { to: "/quotes", label: "Quotes" },
];

const Header = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const [menuOpen, setMenuOpen] = useState(false);

  const desktopNavClass = ({ isActive }) =>
    `relative px-1.5 py-2 text-sm font-medium transition-all duration-300 group
    ${
      isActive
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
    }`;

  const mobileNavClass = ({ isActive }) =>
    `block w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
    ${
      isActive
        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:bg-zinc-950/90 dark:border-zinc-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-200">
            <TbBrain className="text-white text-base" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-800 dark:text-white">
            Mind<span className="text-emerald-500">Journal</span>
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} className={desktopNavClass} end={to === "/"}>
              {({ isActive }) => (
                <>
                  <span>{label}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-emerald-500 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="h-9 w-9 rounded-full flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800 shadow-sm transition-all duration-200 cursor-pointer"
          >
            {theme === "light" ? (
              <FaMoon className="text-slate-600 text-sm" />
            ) : (
              <IoSunny className="text-amber-400 text-sm" />
            )}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden h-9 w-9 rounded-full flex items-center justify-center border border-slate-200 bg-white dark:bg-zinc-900 dark:border-zinc-700 shadow-sm transition-all duration-200 cursor-pointer"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <HiX className="text-slate-700 dark:text-white text-lg" />
            ) : (
              <HiMenuAlt3 className="text-slate-700 dark:text-white text-lg" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        } border-t border-slate-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl`}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={mobileNavClass}
              end={to === "/"}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;