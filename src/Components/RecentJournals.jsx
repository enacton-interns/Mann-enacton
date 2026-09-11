import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { TbNotebook } from "react-icons/tb";

const categoryColors = {
  Grateful:    "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Stressful:   "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Achievement: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Challenge:   "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Reflection:  "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  Goal:        "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

const RecentJournals = () => {
  const navigate = useNavigate();
  const journal = useSelector((state) => state.Journal);
  const selectedDate = useSelector((state) => state.selectedDate);
  const [filteredJournal, setFilteredJournal] = useState([]);

  useEffect(() => {
    const sorted = journal
      .filter((entry) => {
        if (!entry.createdAt) return false;
        const diff = differenceInCalendarDays(
          parseISO(selectedDate),
          parseISO(entry.createdAt),
        );
        return diff >= 0 && diff < 7;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    setFilteredJournal(sorted);
  }, [journal]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Recent Journals
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
            Entries from the last 7 days
          </p>
        </div>
        <Link
          to="/journals"
          className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          View all →
        </Link>
      </div>

      {filteredJournal.length ? (
        <div className="space-y-3 flex-1">
          {filteredJournal.slice(0, 3).map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex justify-between items-center mb-2.5">
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    categoryColors[entry.category] ||
                    "bg-slate-100 text-slate-600 dark:bg-zinc-700 dark:text-slate-300"
                  }`}
                >
                  {entry.category}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {new Date(entry.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div
                className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: entry.text }}
              />

              <Link
                to={`/journals/${entry.id}`}
                className="inline-block mt-3 text-xs font-medium text-sky-500 hover:text-sky-600 dark:text-sky-400 hover:underline"
              >
                Read full entry →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
            <TbNotebook className="text-3xl text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No entries this week</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-5">
            Start your first journal entry today.
          </p>
          <button
            onClick={() => navigate("/addjournal")}
            className="px-5 py-2.5 text-sm rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all cursor-pointer active:scale-95"
          >
            Create Journal Entry
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentJournals;