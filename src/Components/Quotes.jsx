import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavoriteQuote } from "../features/JournalMoodSlice";
import { FaQuoteLeft, FaCopy, FaCheck } from "react-icons/fa";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import { TbRefresh } from "react-icons/tb";

const Quotes = () => {
  const [currentQuote, setCurrentQuote] = useState({ id: null, quote: "", author: "" });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.FavoriteQuotes || []);

  const getQuotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://dummyjson.com/quotes/random");
      setCurrentQuote({ id: res.data.id, quote: res.data.quote, author: res.data.author });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getQuotes(); }, []);

  const isFavorited = favorites.some((q) => q.quote === currentQuote.quote);

  const handleToggleFavorite = () => {
    if (!currentQuote.quote) return;
    dispatch(toggleFavoriteQuote(currentQuote));
  };

  const handleRemoveFavorite = (favQuote) => dispatch(toggleFavoriteQuote(favQuote));
  const handleSelectFavorite = (favQuote) => setCurrentQuote(favQuote);

  const handleCopyQuote = () => {
    if (!currentQuote.quote) return;
    navigator.clipboard.writeText(`"${currentQuote.quote}" — ${currentQuote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 transition-colors duration-300">

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FaQuoteLeft className="text-indigo-400 text-sm" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Inspiration
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
          Daily Inspiration
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Reflect, pause, and carry these thoughts with you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Main Quote Card */}
        <div className="lg:col-span-2">
          <div className="relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md rounded-2xl p-7 sm:p-10 flex flex-col justify-between min-h-[340px] transition-all duration-300">

            {/* Action Buttons */}
            <div className="absolute top-5 right-5 flex items-center gap-2">
              <button
                onClick={handleCopyQuote}
                className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all duration-200 cursor-pointer"
                title="Copy quote"
              >
                {copied
                  ? <FaCheck className="text-emerald-500 text-xs" />
                  : <FaCopy className="text-xs" />}
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isFavorited
                    ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-500 scale-105"
                    : "bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-zinc-700"
                }`}
                title={isFavorited ? "Unpin" : "Pin"}
              >
                {isFavorited
                  ? <BsPinAngleFill className="text-sm" />
                  : <BsPinAngle className="text-sm" />}
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-4">
                <div className="flex gap-2">
                  {[0, 0.1, 0.2].map((delay, i) => (
                    <div
                      key={i}
                      className="h-2.5 w-2.5 animate-bounce rounded-full bg-indigo-400"
                      style={{ animationDelay: `${delay}s` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">Finding inspiration…</span>
              </div>
            ) : (
              <>
                <div className="flex-1 flex flex-col justify-center mt-4 pr-10">
                  <div className="text-slate-200 dark:text-zinc-700 text-4xl mb-5">
                    <FaQuoteLeft />
                  </div>
                  <p className="font-serif italic text-xl sm:text-2xl font-light leading-relaxed text-slate-700 dark:text-slate-200 mb-5">
                    {currentQuote.quote}
                  </p>
                  <p className="text-right text-slate-400 dark:text-slate-500 font-medium text-sm">
                    — {currentQuote.author}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-100 dark:border-zinc-800">
                  <button
                    onClick={getQuotes}
                    className="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                  >
                    <TbRefresh className="text-base" />
                    New Quote
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pinned Quotes Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm rounded-2xl p-5 flex flex-col max-h-[500px]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-4 shrink-0">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <BsPinAngleFill className="text-indigo-500" />
                Pinned Quotes
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400">
                {favorites.length}
              </span>
            </div>

            {favorites.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 py-8">
                <div className="text-3xl mb-3 opacity-30">📌</div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No pinned quotes yet</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Click the pin icon to save quotes here.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {favorites.map((fav) => (
                  <div
                    key={fav.id || fav.quote}
                    onClick={() => handleSelectFavorite(fav)}
                    className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer group ${
                      currentQuote.quote === fav.quote
                        ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800"
                        : "bg-slate-50 dark:bg-zinc-800 border-slate-100 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-700"
                    }`}
                  >
                    <p className="font-serif italic text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-2">
                      "{fav.quote}"
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                        — {fav.author}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveFavorite(fav); }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-200 cursor-pointer"
                      >
                        <BsPinAngleFill className="text-[10px]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotes;
