import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router";
import { TbNotebook } from "react-icons/tb";

const categoryColors = {
  Grateful:    "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  Stressful:   "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  Achievement: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  Challenge:   "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  Reflection:  "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200 dark:border-sky-800",
  Goal:        "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200 dark:border-violet-800",
};

const JournalList = ({ filteredData, handleDelete }) => {
  if (filteredData.length === 0) {
    return (
      <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <TbNotebook className="text-4xl text-slate-300 dark:text-slate-600" />
        </div>
        <p className="text-base font-medium text-slate-500 dark:text-slate-400">No journals found</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          Try adjusting filters or create a new entry.
        </p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
      {filteredData.map((d) => (
        <article
          key={d.id}
          className="group relative flex flex-col border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          {/* Top: category + date */}
          <div className="flex items-center justify-between mb-3">
            <span
              className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                categoryColors[d.category] ||
                "bg-slate-100 text-slate-600 dark:bg-zinc-700 dark:text-slate-300 border-slate-200 dark:border-zinc-600"
              }`}
            >
              {d.category}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {new Date(d.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Content */}
          <div
            className="flex-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4 prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: d.text }}
          />

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
            <Link
              to={`/journals/${d.id}`}
              title="View Journal"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-white transition-all duration-200"
            >
              <FaEye className="text-sm" />
              View
            </Link>
            <Link
              to={`/addjournal/${d.id}`}
              title="Edit Journal"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-200"
            >
              <FaEdit className="text-sm" />
              Edit
            </Link>
            <button
              onClick={() => handleDelete(d.id)}
              title="Delete Journal"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 cursor-pointer"
            >
              <MdDelete className="text-sm" />
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default JournalList;