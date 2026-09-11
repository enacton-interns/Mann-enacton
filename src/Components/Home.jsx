import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import RecentActivities from "./RecentActivities";
import RecentJournals from "./RecentJournals";
import { TbNotebook, TbMoodSmile, TbSparkles } from "react-icons/tb";

const prompts = [
  "What is something you're looking forward to today?",
  "What brought you a sense of peace recently?",
  "What is one small win you've had lately?",
  "What is taking up most of your thoughts right now?",
  "What is something you're proud of today?",
  "What gave you energy this week?",
  "What is one challenge you're working through?",
  "What is something kind you did for yourself recently?",
  "What are you learning about yourself these days?",
  "What is one thing you wish you had more of today?",
  "What helped you feel supported recently?",
  "What is something you'd like to celebrate today?",
  "What is one thing that surprised you this week?",
  "What are you hoping for right now?",
  "What is something that made you feel connected to others?",
  "What is one thought you'd like to revisit later?",
  "What is something you appreciate about yourself today?",
  "What is one habit you'd like to strengthen?",
  "What is something that feels important to you right now?",
  "What would make today feel meaningful?",
];

const Home = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(prompts[0]);

  const journals = useSelector((state) => state.Journal);
  const moods = useSelector((state) => state.Mood);

  const refreshPrompt = () => {
    const random = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(random);
  };

  const stats = [
    {
      icon: <TbNotebook className="text-emerald-600 dark:text-emerald-400 text-xl" />,
      label: "Journal Entries",
      value: journals.length,
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      icon: <TbMoodSmile className="text-sky-600 dark:text-sky-400 text-xl" />,
      label: "Mood Logs",
      value: moods.length,
      bg: "bg-sky-50 dark:bg-sky-900/20",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 text-slate-800 dark:text-slate-100 transition-colors duration-300">

      {/* HERO */}
      <section className="grid lg:grid-cols-2 gap-8 xl:gap-12 items-center mb-12">
        <div>
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 mb-5">
            <TbSparkles className="text-emerald-500 text-sm" />
            <span className="text-xs font-semibold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
              Wellness Journal
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Understand Yourself
            <br />
            <span className="text-emerald-500">One Entry</span> at a Time.
          </h1>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-500 dark:text-slate-400 max-w-xl">
            Journal your thoughts, track emotional patterns, and build a
            healthier relationship with your mind through consistent reflection.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl ${s.bg} border border-transparent`}
              >
                {s.icon}
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-none mb-0.5">{s.label}</p>
                  <p className="text-lg font-bold leading-none text-slate-800 dark:text-white">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mt-7">
            <button
              onClick={() => navigate("/addjournal")}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 cursor-pointer active:scale-95"
            >
              Start Writing
            </button>
            <button
              onClick={() => navigate("/moods")}
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-zinc-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 transition-all duration-200 cursor-pointer"
            >
              Track Today's Mood
            </button>
          </div>
        </div>

        {/* Prompt Card */}
        <div className="rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Daily Reflection
            </span>
          </div>

          <h2 className="text-lg font-semibold mt-3 mb-5 text-slate-800 dark:text-slate-100">
            Today's Prompt
          </h2>

          <p className="text-lg italic leading-relaxed text-slate-600 dark:text-slate-300 min-h-[80px]">
            "{prompt}"
          </p>

          <div className="mt-8">
            <button
              onClick={refreshPrompt}
              className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer"
            >
              New Prompt
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Your Activity</h2>
          <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-800" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivities />
          <RecentJournals />
        </div>
      </section>
    </div>
  );
};

export default Home;