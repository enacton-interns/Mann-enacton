import { useDispatch, useSelector } from "react-redux";
import { deleteJournal, addActivity } from "../features/JournalMoodSlice";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import FilterDropdown from "./FilterDropdown";
import JournalList from "./JournalList";
import { InputText } from "primereact/inputtext";
import { TbSearch, TbBooks } from "react-icons/tb";

const AllJournals = () => {
  const data = useSelector((state) => state.Journal);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    date: "30",
    category: "All",
  });

  const handleDelete = (id) => {
    const isConfirm = confirm("Are you sure you want to delete this journal?");
    if (!isConfirm) return;
    dispatch(deleteJournal(id));
    dispatch(
      addActivity({
        type: "journal_deleted",
        message: "Deleted a journal entry",
      }),
    );
  };

  const categoryFilters = [
    { label: "All", value: "All" },
    { label: "Grateful", value: "Grateful" },
    { label: "Stressful", value: "Stressful" },
    { label: "Achievement", value: "Achievement" },
    { label: "Challenge", value: "Challenge" },
    { label: "Reflection", value: "Reflection" },
    { label: "Goal", value: "Goal" },
  ];

  const dateFilter = [
    { label: "Last Month", value: "30" },
    { label: "Last Week", value: "7" },
    { label: "Today", value: "Today" },
  ];

  const handleOnCategoryFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, category: e.value }));
  };

  const handleOnDateFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, date: e.value }));
  };

  useEffect(() => {
    let result = [...data];

    if (filters.category !== "All") {
      result = result.filter((journal) => journal.category === filters.category);
    }

    const today = new Date();

    if (filters.date === "Today") {
      result = result.filter((journal) => {
        const journalDate = new Date(journal.createdAt);
        return (
          journalDate.getDate() === today.getDate() &&
          journalDate.getMonth() === today.getMonth() &&
          journalDate.getFullYear() === today.getFullYear()
        );
      });
    }

    if (filters.date === "7") {
      result = result.filter((journal) => {
        const diffDays = (today - new Date(journal.createdAt)) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      });
    }

    if (filters.date === "30") {
      result = result.filter((journal) => {
        const diffDays = (today - new Date(journal.createdAt)) / (1000 * 60 * 60 * 24);
        return diffDays <= 30;
      });
    }

    if (debouncedSearch) {
      result = result.filter((journal) => {
        return (
          journal.text?.toLowerCase().includes(debouncedSearch) ||
          journal.category?.toLowerCase().includes(debouncedSearch)
        );
      });
    }

    setFilteredData(result);
  }, [data, filters, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 transition-colors duration-300">

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <TbBooks className="text-emerald-500 text-xl" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            My Journals
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
          All Journals
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          {filteredData.length} {filteredData.length === 1 ? "entry" : "entries"} found
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-base" />
          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search journals…"
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 placeholder:text-slate-400 dark:placeholder:text-slate-600"
          />
        </div>

        {/* Filters + CTA */}
        <div className="flex items-center gap-6 flex-wrap">
          <FilterDropdown
            value={filters.date}
            onChange={handleOnDateFilterChange}
            options={dateFilter}
          />
          <FilterDropdown
            value={filters.category}
            onChange={handleOnCategoryFilterChange}
            options={categoryFilters}
          />
          <Link
            to="/addjournal"
            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-sm rounded-xl font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            + New Journal
          </Link>
        </div>
      </div>

      <JournalList filteredData={filteredData} handleDelete={handleDelete} />
    </div>
  );
};

export default AllJournals;
