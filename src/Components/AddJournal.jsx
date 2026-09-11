import { useEffect, useState } from "react";
import { Editor } from "primereact/editor";
import toast, { Toaster } from "react-hot-toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { editJournal, newJournal, addActivity } from "../features/JournalMoodSlice";
import { useNavigate, useParams } from "react-router";
import { FaArrowLeftLong } from "react-icons/fa6";
import { TbPencil, TbEdit } from "react-icons/tb";

const AddJournal = () => {
  const params = useParams();
  const [thought, setThought] = useState("");
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { label: "Grateful", value: "Grateful" },
    { label: "Stressful", value: "Stressful" },
    { label: "Achievement", value: "Achievement" },
    { label: "Challenge", value: "Challenge" },
    { label: "Reflection", value: "Reflection" },
    { label: "Goal", value: "Goal" },
  ];

  const dispatch = useDispatch();
  const data = useSelector((state) => state.Journal);

  const fetchData = () => {
    if (params.id) {
      const filter = data.find((d) => d.id == params.id);
      if (filter) {
        setThought(filter.text);
        setSelectedCategory(filter.category);
      }
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, []);

  const handleJournalAdd = () => {
    if (selectedCategory != null && thought != undefined && thought != "") {
      dispatch(
        newJournal({
          category: selectedCategory,
          text: thought,
        }),
      );

      dispatch(
        addActivity({
          type: "journal_added",
          message: "Added a new journal entry",
        }),
      );

      setThought("");
      setSelectedCategory(null);

      toast.success("Journal Added", {
        duration: 3000,
        position: "top-right",
      });
      navigate("/journals");
    } else {
      if (selectedCategory == null) {
        toast.error("Please select a category", {
          duration: 3000,
          position: "top-right",
        });
      }

      if (thought == undefined || thought == "") {
        toast.error("Please enter your thoughts", {
          duration: 3000,
          position: "top-right",
        });
      }
    }
  };

  const handleJournalEntry = () => {
    if (params.id) {
      dispatch(
        editJournal({
          id: params.id,
          category: selectedCategory,
          text: thought,
        }),
      );

      dispatch(
        addActivity({
          type: "journal_edited",
          message: "Edited a journal entry",
        }),
      );

      setThought("");
      setSelectedCategory(null);
      navigate("/journals");
    } else {
      handleJournalAdd();
    }

  };

  const isEditing = !!params.id;

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

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm shadow-emerald-500/30">
            {isEditing ? (
              <TbEdit className="text-white text-xl" />
            ) : (
              <TbPencil className="text-white text-xl" />
            )}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
              {isEditing ? "Edit Journal" : "New Journal Entry"}
            </h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
              {isEditing
                ? "Make changes to your journal entry."
                : "Take a moment to capture your thoughts and feelings."}
            </p>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Category <span className="text-red-400">*</span>
          </label>
          <Dropdown
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.value)}
            options={categories}
            placeholder="Select a Category"
            className="w-full sm:w-64"
            pt={{
              root: {
                className:
                  "p-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-slate-700 dark:text-slate-200",
              },
              panel: {
                className:
                  "bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-lg",
              },
              item: {
                className:
                  "px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-zinc-700 cursor-pointer",
              },
            }}
            highlightOnSelect={false}
          />
        </div>

        {/* Editor */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Your Thoughts <span className="text-red-400">*</span>
          </label>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm">
            <Editor
              value={thought}
              onTextChange={(e) => setThought(e.htmlValue)}
              style={{ height: "320px" }}
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleJournalEntry}
            className="px-7 py-2.5 text-sm rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 cursor-pointer active:scale-95"
          >
            {isEditing ? "Save Changes" : "Save Entry"}
          </button>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default AddJournal;
