import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import MyCalendar from "./Calendar";
import { useDispatch, useSelector } from "react-redux";
import { MoodLineChart } from "./MoodLineChart";
import "../index.css";
import { newMood, deleteMood, addActivity } from "../features/JournalMoodSlice";
import toast, { Toaster } from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { TbMoodSmile } from "react-icons/tb";
import AnalyticalMood from "./AnalyticalMood";
import { moodLabels } from "../Data/mood";

const Moods = () => {
  const moods = useSelector((state) => state.Mood);
  const selectedDate = useSelector((state) => state.selectedDate);

  const [time, setTime] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState(null);

  const dispatch = useDispatch();

  const emojis = ["😁", "😊", "😐", "😕", "😢"];

  const moodsForSelectedDate = moods
    .filter((mood) => {
      if (!mood.addedAt) return false;
      return (
        new Date(mood.addedAt).toISOString().split("T")[0] === selectedDate
      );
    })
    .sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));

  const canAddMood = () => {
    if (!selectedMood || !time) {
      toast.error("Select Time and Mood", {
        duration: 3000,
        position: "top-right",
      });
      return false;
    }
    return true;
  };

  const handleAddMood = () => {
    if (!canAddMood()) return;

    const timePart = time.toTimeString().split(" ")[0];
    const moodDateTime = `${selectedDate}T${timePart}`;
    dispatch(
      newMood({
        emoji: selectedMood,
        addedAt: moodDateTime,
      }),
    );

    dispatch(
      addActivity({
        type: "mood_added",
        message: `Logged mood as ${selectedMood}`,
      }),
    );

    setSelectedMood(null);
    setTime(new Date());

    toast.success("Mood Added");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 transition-colors duration-300">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <TbMoodSmile className="text-sky-500 text-xl" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Mood Tracker
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
          How Are You Feeling?
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Log your mood and track your emotional patterns over time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left Panel: Mood Input */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6 flex flex-col gap-5">
          <div>
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-100 mb-1">
              Select Your Mood
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Pick the emoji that best represents how you feel right now.
            </p>
          </div>

          {/* Emoji Grid */}
          <div className="grid grid-cols-5 gap-2">
            {emojis.map((emoji, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <button
                  onClick={() => setSelectedMood(emoji)}
                  className={`
                    w-full aspect-square
                    rounded-2xl text-2xl sm:text-3xl
                    flex items-center justify-center
                    cursor-pointer transition-all duration-200
                    ${
                      selectedMood === emoji
                        ? "bg-linear-to-br from-emerald-400 to-sky-400 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 ring-2 ring-emerald-300 dark:ring-emerald-700 scale-105"
                        : "bg-slate-50 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 hover:scale-105"
                    }
                  `}
                >
                  {emoji}
                </button>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  {moodLabels[emoji]}
                </span>
              </div>
            ))}
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Time Entry{" "}
              <span className="text-slate-400 text-[10px]">(24h Format)</span>
            </label>
            <Calendar
              value={time}
              onChange={(e) => setTime(e.value)}
              timeOnly
              appendTo="self"
              className="w-full"
              inputClassName="h-11 w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-slate-200 px-4 text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              pt={{
                panel: {
                  className:
                    "custom-time-panel dark:bg-zinc-800 dark:text-slate-200",
                },
                timepicker: {
                  className:
                    "custom-timepicker dark:bg-zinc-800 dark:text-black",
                },
              }}
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleAddMood}
            className="w-full cursor-pointer rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40 active:scale-95"
          >
            Log Mood
          </button>

          {/* Mini Calendar */}
          <div className="pt-2 h-full flex flex-col justify-center border-t border-slate-100 dark:border-zinc-800">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-wider">
              Select Date
            </p>
            <MyCalendar />
          </div>
        </div>

        {/* Right Panel: Chart + Entries */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-100">
              Mood Insights
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Your emotional distribution for the selected date.
            </p>
          </div>
          {/* Chart */}
          <div className="mt-1">
            <AnalyticalMood />
          </div>
          <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 p-3 sm:p-4">
            <div className="h-64 sm:h-72">
              <MoodLineChart />
            </div>
          </div>
          {/* Mood Entries List */}
          <div>
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">
              Entries for{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </h3>

            {moodsForSelectedDate.length === 0 ? (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                <p className="text-sm">
                  No mood entries for{" "}
                  {selectedDate == new Date().toISOString().split("T")[0]
                    ? "Today"
                    : new Date(selectedDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                </p>
                <p className="text-xs mt-1">
                  Log a mood using the panel on the left.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
                {moodsForSelectedDate.map((mood) => (
                  <div
                    key={mood.id}
                    className="flex items-center hover:translate-y-[-4px] transition-all ease-in-out duration-300 justify-between gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{mood.emoji}</span>
                      <div>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                          {moodLabels[mood.emoji] || "Mood"}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">
                          {new Date(mood.addedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => dispatch(deleteMood(mood.id))}
                      className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 text-sm cursor-pointer transition-colors duration-200"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Moods;
