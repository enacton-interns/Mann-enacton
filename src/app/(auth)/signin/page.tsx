"use client";

import { useState } from "react";
import Link from "next/link";
import { handleSignin } from "../_actions/auth";
import { Package } from "lucide-react";
import toast from "react-hot-toast";
import Toaster from "@/app/components/Toast"
import { redirect } from "next/navigation";

export default function SigninPage() {
  const [error, setError] = useState<{ email?: string[]; password?: string[] } | null>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const result = await handleSignin(new FormData(e.currentTarget));

    if(result.success) {
      toast.success(result.message as string);
      redirect("/dashboard");
    } else {
      if(typeof result.errors === "string"){
        toast.error(result.errors as string);
      }
      else{
        setError(result.errors);
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background decorations */}
      <div className="absolute -top-50 -right-50 w-150 h-150 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-25 -left-25 w-100 h-100 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-105 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-10 relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <Package size={16} absoluteStrokeWidth className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1.5">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to your InvenPro account
          </p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[13px] font-semibold text-slate-700 dark:text-slate-300"
            >
              Email Address
            </label>
            <input
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
            />
            <span className="text-red-500 text-xs block h-2">
              {error?.email && error.email[0]}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[13px] font-semibold text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <input
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
            />
            <span className="text-red-500 text-xs block h-2">
              {error?.password && error.password[0]}
            </span>
          </div>

          <button
            className="mt-2 w-full py-3 px-4 bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-lg shadow-md shadow-indigo-500/20 transition-transform active:scale-[0.98]"
            type="submit"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
      <Toaster />
    </div>
  );
}