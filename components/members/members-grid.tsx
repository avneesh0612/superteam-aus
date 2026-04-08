"use client";

import { useMemo, useState } from "react";
import { Member } from "@/lib/types";
import { MemberCard } from "@/components/members/member-card";
import { MembersFilters } from "@/components/members/members-filters";

export function MembersGrid({ members }: { members: Member[] }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(() => {
    return members.filter((member) => {
      const haystack = [member.name, member.role, member.company, ...(member.tags || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = haystack.includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Core Team" && member.badge === "Core Team") ||
        member.tags.some((tag) => tag.toLowerCase() === activeFilter.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [members, search, activeFilter]);

  return (
    <div className="space-y-10">
      <MembersFilters
        search={search}
        setSearch={setSearch}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {filtered.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
