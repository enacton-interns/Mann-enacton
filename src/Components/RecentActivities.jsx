import { useSelector } from 'react-redux';
import { MdBookmarkAdded, MdDelete } from "react-icons/md";
import { FaEdit } from 'react-icons/fa';
import { TbMoodEdit } from "react-icons/tb";
import { formatDistanceToNow } from 'date-fns';

const iconConfig = {
  journal_added: { icon: MdBookmarkAdded,bg: "bg-emerald-100 dark:bg-emerald-900/40", color: "text-emerald-600 dark:text-emerald-400" },
  journal_edited: { icon: FaEdit, bg: "bg-sky-100 dark:bg-sky-900/40", color: "text-sky-600 dark:text-sky-400" },
  journal_deleted: { icon: MdDelete, bg: "bg-red-100 dark:bg-red-900/40", color: "text-red-500 dark:text-red-400" },
  mood_added: { icon: TbMoodEdit, bg: "bg-violet-100 dark:bg-violet-900/40",color: "text-violet-600 dark:text-violet-400" },
};

const RecentActivities = () => {
  const activities = useSelector((state) => state.activities);
  const sliced = activities.slice(0, 6);

  const getConfig = (type) => iconConfig[type] || {
    icon: () => <span>📌</span>,
    bg: "bg-slate-100 dark:bg-zinc-800",
    color: "text-slate-500",
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Recent Activities
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
            Your latest journal and mood updates
          </p>
        </div>
        <span className="rounded-full px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
          {sliced.length} {sliced.length === 1 ? "activity" : "activities"}
        </span>
      </div>

      {sliced.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
          <div className="text-4xl mb-3 opacity-30">📋</div>
          <p className="text-sm text-slate-400 dark:text-slate-500">No activities yet.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Start journaling or logging moods!</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-2 bottom-2 w-px bg-slate-100 dark:bg-zinc-800" />

          <div className="space-y-4">
            {sliced.map((activity) => {
              const cfg = getConfig(activity.type);
              const IconComp = cfg.icon;
              return (
                <div key={activity.id} className="relative flex gap-4 items-start">
                  <div className={`z-10 shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${cfg.bg} shadow-sm`}>
                    <IconComp className={`${cfg.color} text-base`} />
                  </div>

                  <div className="flex-1 min-w-0 bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700/50 rounded-xl px-4 py-3 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm transition-all duration-200">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                      {activity.message}
                    </p>
                    {activity.timestamp && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;