import { useSelector } from "react-redux";
import {moodData,moodScaleData} from "../Data/mood";

const AnalyticalMood = () => {

  const moods = useSelector((state) => state.Mood);

    const year =  new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const week = Math.ceil(new Date().getDate() / 7);

    const MoodByWeekAndYear = moods.filter((m) => (Number(m.addedAt.split('T')[0].split("-")[1]) == month && Number(m.addedAt.split('T')[0].split("-")[0]) == year && Math.ceil(new Date(m.addedAt).getDate() / 7) == week))

    const WeeklyAverageMood = Math.round(MoodByWeekAndYear.reduce((acc, mood) => {
      const value = moodScaleData[mood.emoji] || 0;
      return acc + value;
    }, 0) / MoodByWeekAndYear.length) || 1;

    const MoodByMonthAndYear = moods.filter((m) => (Number(m.addedAt.split('T')[0].split("-")[1]) == month && Number(m.addedAt.split('T')[0].split("-")[0]) == year))

    const MonthlyAverageMood = Math.round(MoodByMonthAndYear.reduce((acc, mood) => {
      const value = moodScaleData[mood.emoji] || 0;
      return acc + value;
    }, 0) / MoodByMonthAndYear.length) || 1;
    

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-4">
          <p className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            Weekly Average
          </p>

          <div className="flex items-center gap-3 mt-2">
            <span className="text-3xl">
              {moodData[WeeklyAverageMood].emoji}
            </span>

            <div>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {moodData[WeeklyAverageMood].label}
              </p>
              <p className="text-xs text-slate-500">Last 7 days</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-sky-100 dark:border-sky-900/40 bg-sky-50 dark:bg-sky-950/20 p-4">
          <p className="text-xs uppercase tracking-wide text-sky-600 dark:text-sky-400">
            Monthly Average
          </p>

          <div className="flex items-center gap-3 mt-2">
            <span className="text-3xl">
              {moodData[MonthlyAverageMood].emoji}
            </span>

            <div>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {moodData[MonthlyAverageMood].label}
              </p>
              <p className="text-xs text-slate-500">This month</p>
            </div>
          </div>
        </div>
      </div>
    );
}

export default AnalyticalMood;