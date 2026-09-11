import { Dropdown } from "primereact/dropdown";
const FilterDropdown = ({ value, onChange, options }) => {
    return (
      <div className="relative">
        <Dropdown
          value={value}
          onChange={onChange}
          options={options}
          pt={{
            root: {
              className:"rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:border-emerald-500 transition-all",
            },
            input: {
              className:"px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200",
            },
            trigger: {
              className: "text-slate-500 dark:text-slate-400 p-1",
            },
            panel: {
              className:"rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg",
            },
            item: {
              className:"px-3 py-2 hover:bg-emerald-50 dark:hover:bg-slate-700 dark:text-slate-200",
            },
          }}
          highlightOnSelect={false}
        />
      </div>
    );
}

export default FilterDropdown