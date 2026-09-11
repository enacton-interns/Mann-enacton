import { useNavigate, useParams } from "react-router";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Editor } from "primereact/editor";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { TbEye, TbLock } from "react-icons/tb";

const ViewJournal = () => {
  const data = useSelector((state) => state.Journal);
  const params = useParams();
  const [thought, setThought] = useState("");
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [entryDate, setEntryDate] = useState(null);

  const categoryColors = {
    Grateful:    "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    Stressful:   "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    Achievement: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    Challenge:   "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    Reflection:  "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200 dark:border-sky-800",
    Goal:        "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200 dark:border-violet-800",
  };

  const fetchData = () => {
    if (params.id) {
      const filter = data.find((d) => d.id == params.id);
      if (filter) {
        setThought(filter.text);
        setSelectedCategory(filter.category);
        setEntryDate(filter.createdAt);
      }
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 min-h-[calc(100vh-4rem)] transition-colors duration-300">

      {/* Page Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer mb-4"
        >
          <FaArrowLeftLong className="text-xs" />
          Back to Journals
        </button>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-sky-500/30 shrink-0">
            <TbEye className="text-white text-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
                View Journal
              </h1>
              {/* Read Only Badge */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-zinc-700">
                <TbLock className="text-xs" />
                Read only
              </span>
              {/* Category Badge */}
              {selectedCategory && (
                <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${categoryColors[selectedCategory] || "bg-slate-100 text-slate-600"}`}>
                  {selectedCategory}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
              {entryDate
                ? `Written on ${new Date(entryDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`
                : "Review your journal entry."}
            </p>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm p-6 sm:p-8 space-y-6">

        {/* Journal Content */}
        <div>
          <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
            Journal Entry
          </label>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm">
            <Editor value={thought} readOnly style={{ height: "320px" }} />
          </div>
        </div>

        {/* Footer action */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate(`/addjournal/${params.id}`)}
            className="px-6 py-2.5 text-sm rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
          >
            Edit Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewJournal;
