import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MoveHorizontal } from "lucide-react";
import PageShell from "@/components/PageShell";
import elements from "@/data/elements.json";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/data/chem";

export default function PeriodicGalaxy() {
  const nav = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const categories = useMemo(
    () => ["all", ...Object.keys(CATEGORY_LABELS)],
    []
  );

  const isDim = (e) => {
    if (query) {
      const q = query.toLowerCase();
      if (!(e.name.toLowerCase().includes(q) || e.symbol.toLowerCase() === q || String(e.number) === q))
        return true;
    }
    if (filter !== "all" && e.category !== filter) return true;
    return false;
  };

  return (
    <PageShell
      testId="periodic-galaxy-page"
      title="Periodic Galaxy"
      subtitle="Every element is a glowing world. Tap any tile to open its 3D atomic profile."
      accent="#7CFF3C"
    >
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            data-testid="element-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search element, symbol or number…"
            className="w-full glass rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--cyan)] transition-colors"
          />
        </div>
        {/* Category Filters — Touch scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 touch-scroll">
          {categories.slice(0, 8).map((c) => (
            <button
              key={c}
              data-testid={`filter-${c}`}
              onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                filter === c ? "text-black font-semibold shadow-sm" : "glass text-[var(--muted)] hover:text-white"
              }`}
              style={filter === c ? { background: c === "all" ? "#7CFF3C" : CATEGORY_COLORS[c] } : {}}
            >
              {c === "all" ? "All Elements" : CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="flex md:hidden items-center justify-center gap-1.5 text-xs text-[var(--muted)] mb-3 font-mono glass py-1.5 px-3 rounded-full w-fit mx-auto">
        <MoveHorizontal className="w-3.5 h-3.5 text-[var(--cyan)]" /> Swipe to explore all columns
      </div>

      {/* Table grid with touch scrolling */}
      <div className="overflow-x-auto pb-4 touch-scroll rounded-2xl glass p-3 sm:p-4 border border-[var(--border)]">
        <div
          className="grid gap-1.5 min-w-[850px] sm:min-w-[900px]"
          style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}
        >
          {elements.map((e) => {
            const color = CATEGORY_COLORS[e.category];
            const dim = isDim(e);
            return (
              <button
                key={e.number}
                data-testid={`element-${e.symbol}`}
                onClick={() => nav(`/element/${e.number}`)}
                className="relative aspect-square rounded-md sm:rounded-lg flex flex-col items-center justify-center transition-all duration-150 hover:scale-110 hover:z-10 active:scale-95 cursor-pointer select-none"
                style={{
                  gridColumn: e.col,
                  gridRow: e.row,
                  background: `${color}18`,
                  border: `1px solid ${color}55`,
                  opacity: dim ? 0.15 : 1,
                  boxShadow: `inset 0 0 10px ${color}22`,
                }}
              >
                <span className="text-[7px] absolute top-0.5 left-1 text-[var(--muted)] font-mono">{e.number}</span>
                <span className="font-display font-bold text-xs sm:text-sm md:text-base leading-none" style={{ color }}>
                  {e.symbol}
                </span>
                <span className="text-[6px] md:text-[7px] text-[var(--muted)] truncate w-full text-center px-0.5 hidden md:block">
                  {e.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-6 sm:mt-8 glass p-4 rounded-2xl">
        {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
          <div key={k} className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: CATEGORY_COLORS[k] }} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
