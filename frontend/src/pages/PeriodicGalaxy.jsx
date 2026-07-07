import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
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
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            data-testid="element-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search element or symbol…"
            className="w-full glass rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--cyan)]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.slice(0, 7).map((c) => (
            <button
              key={c}
              data-testid={`filter-${c}`}
              onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === c ? "text-black" : "glass text-[var(--muted)] hover:text-white"
              }`}
              style={filter === c ? { background: c === "all" ? "#7CFF3C" : CATEGORY_COLORS[c] } : {}}
            >
              {c === "all" ? "All" : CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto pb-4">
        <div
          className="grid gap-1.5 min-w-[900px]"
          style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}
        >
          {elements.map((e) => {
            const color = CATEGORY_COLORS[e.category];
            const dim = isDim(e);
            return (
              <motion.button
                key={e.number}
                data-testid={`element-${e.symbol}`}
                onClick={() => nav(`/element/${e.number}`)}
                whileHover={{ scale: 1.12, zIndex: 5 }}
                className="relative aspect-square rounded-md flex flex-col items-center justify-center transition-opacity"
                style={{
                  gridColumn: e.col,
                  gridRow: e.row,
                  background: `${color}18`,
                  border: `1px solid ${color}55`,
                  opacity: dim ? 0.15 : 1,
                  boxShadow: `inset 0 0 12px ${color}22`,
                }}
              >
                <span className="text-[7px] absolute top-0.5 left-1 text-[var(--muted)]">{e.number}</span>
                <span className="font-display font-bold text-sm md:text-base" style={{ color }}>
                  {e.symbol}
                </span>
                <span className="text-[6px] md:text-[7px] text-[var(--muted)] truncate w-full text-center px-0.5 hidden md:block">
                  {e.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-8">
        {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
          <div key={k} className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <span className="w-3 h-3 rounded" style={{ background: CATEGORY_COLORS[k] }} />
            {label}
          </div>
        ))}
      </div>
    </PageShell>
  );
}
