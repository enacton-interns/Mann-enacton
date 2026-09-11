import React from "react";
import { NavLink } from "react-router";
import { TbBrain } from "react-icons/tb";
import { FaGithub } from "react-icons/fa";

const footerLinks = [
  { to: "/", label: "Home" },
  { to: "/journals", label: "Journals" },
  { to: "/moods", label: "Moods" },
  { to: "/quotes", label: "Quotes" },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col gap-1 w-full sm:w-auto items-start sm:items-center">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <TbBrain className="text-white text-sm" />
              </div>
              <span className="font-bold text-sm text-slate-800 dark:text-white">
                Mind<span className="text-emerald-500">Journal</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-center sm:text-left">
              Your daily companion for mental wellness.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col sm:flex-row items-start w-full sm:w-auto gap-5 flex-wrap justify-center">
            {footerLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Divider + bottom line */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span>
            © {new Date().getFullYear()} MindJournal. Built with pure heart for
            mental wellness.
          </span>
          <span>All your data is stored locally on your device.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
