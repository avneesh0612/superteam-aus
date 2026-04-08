"use client";

import { Search } from "lucide-react";

const filters = ["All", "Core Team", "Rust", "Frontend", "Design", "Content", "Growth", "Product", "Community"];

export function MembersFilters({
  search,
  setSearch,
  activeFilter,
  setActiveFilter,
}: {
  search: string;
  setSearch: (value: string) => void;
  activeFilter: string;
  setActiveFilter: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, skill, or role..."
          className="w-full rounded-2xl border border-white/5 bg-panel px-12 py-4 text-sm text-text outline-none placeholder:text-muted"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              activeFilter === filter
                ? "bg-green text-deepgreen"
                : "border border-white/5 bg-panel text-muted hover:text-text"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
