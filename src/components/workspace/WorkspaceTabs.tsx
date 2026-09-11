"use client";

const tabs = [
  {
    label: "Semantic Search",
    value: "search",
  },
  {
    label: "Transcript",
    value: "transcript",
  },
  {
    label: "Generate",
    value: "generate",
  },
] as const;

type Tab = (typeof tabs)[number]["value"];

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

export default function WorkspaceTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="mb-8 overflow-x-auto border-b border-zinc-200 dark:border-white/10">
      <div className="flex min-w-max gap-6">
        {tabs.map((tab) => {
          const active = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onTabChange(tab.value)}
              className={`border-b-2 px-2 py-2 text-sm transition ${
                active
                  ? "border-black text-black dark:border-white dark:text-white"
                  : "border-transparent text-zinc-500 hover:text-black dark:hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
