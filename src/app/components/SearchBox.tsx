import { Search } from "lucide-react";

type Props = {
  setSearch: (search: string) => void;
  search: string;
};

export default function SearchBox({ setSearch, search }: Props) {
  return (
    <form className="max-w-md mx-auto">
      <label
        htmlFor="search"
        className="block mb-2.5 text-sm font-medium text-heading sr-only"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
          <Search size={16} absoluteStrokeWidth />
        </div>
        <input
          type="search"
          name="search"
          className="block w-full p-3 ps-9 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs"
          placeholder="Search a product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
        />
      </div>
    </form>
  );
}
