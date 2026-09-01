import React, { useState, useMemo, useCallback } from "react";
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

  const isDim = useCallback(
    (e) => {
      if (query) {
        const q = query.toLowerCase().trim();
        if (!(e.name.toLowerCase().includes(q) || e.symbol.toLowerCase() === q || String(e.number) === q))
          return true;
      }
      if (filter !== "all" && e.category !== filter) return true;
      return false;
    },
    [query, filter]
  );

  const matchedCount = useMemo(() => {
    return elements.filter((e) => !isDim(e)).length;
  }, [isDim]);

  return (
    <PageShell
      testId="periodic-galaxy-page"
      title="Periodic Galaxy"
      subtitle="Complete 118-element quantum matrix. Select any element tile to open its structural Bohr profile and atomic spectroscopy data."
      accent="#00F5FF"
    >
      {/* Search & Spectroscopy Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 items-stretch lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cyan)]" />
          <input
            data-testid="element-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search element name, symbol (e.g. Au, Fe) or atomic number…"
            className="w-full glass rounded-full pl-11 pr-4 py-3 text-xs sm:text-sm font-mono text-[#E6F7FF] placeholder-[var(--muted)] outline-none border border-[rgba(0,245,255,0.2)] focus:border-[var(--cyan)] focus:shadow-[0_0_20px_rgba(0,245,255,0.25)] transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--muted)] hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Telemetry matched counter */}
        <div className="flex items-center gap-3 font-mono text-xs text-[var(--muted)] justify-between lg:justify-end">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-[rgba(0,245,255,0.12)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] pulsering" />
            <span>ELEMENTS: <strong className="text-[var(--cyan)]">{matchedCount}</strong>/118</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 mb-5 sm:mb-6 touch-scroll">
        {categories.map((c) => {
          const active = filter === c;
          const catColor = c === "all" ? "#00F5FF" : CATEGORY_COLORS[c];
          return (
            <button
              key={c}
              data-testid={`filter-${c}`}
              onClick={() => setFilter(c)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-mono whitespace-nowrap shrink-0 transition-all cursor-pointer border flex items-center gap-1.5 ${
                active
                  ? "bg-[#0B1224] text-[#E6F7FF] font-semibold shadow-[0_0_15px_rgba(0,245,255,0.3)]"
                  : "glass text-[var(--muted)] hover:text-[#E6F7FF] hover:border-[rgba(0,245,255,0.3)]"
              }`}
              style={{
                borderColor: active ? catColor : "rgba(0,245,255,0.12)",
                boxShadow: active ? `0 0 14px ${catColor}44` : undefined,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: catColor }} />
              <span>{c === "all" ? "All Elements (118)" : CATEGORY_LABELS[c]}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Swipe Hint */}
      <div className="flex lg:hidden items-center justify-center gap-2 text-[11px] text-[var(--muted)] mb-3 font-mono glass py-1.5 px-3.5 rounded-full w-fit mx-auto border border-[rgba(0,245,255,0.15)]">
        <MoveHorizontal className="w-3.5 h-3.5 text-[var(--cyan)] animate-pulse" />
        <span>SWIPE HORIZONTALLY TO EXPLORE PERIODIC TABLE (18 GROUPS)</span>
      </div>

      {/* Table grid with touch scrolling */}
      <div className="overflow-x-auto pb-4 touch-scroll rounded-3xl glass p-3.5 sm:p-5 border border-[rgba(0,245,255,0.18)] shadow-[0_8px_32px_rgba(5,8,22,0.6)]">
        <div
          className="grid gap-1.5 sm:gap-2 min-w-[880px] sm:min-w-[960px]"
          style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}
        >
          {elements.map((e) => {
            const color = CATEGORY_COLORS[e.category] || "#00F5FF";
            const dim = isDim(e);
            return (
              <button
                key={e.number}
                data-testid={`element-${e.symbol}`}
                onClick={() => nav(`/element/${e.number}`)}
                className="group relative aspect-[1/1.08] sm:aspect-square rounded-lg flex flex-col items-center justify-between p-1 sm:p-1.5 transition-all duration-200 hover:scale-115 hover:z-20 active:scale-95 cursor-pointer select-none text-left"
                style={{
                  gridColumn: e.col,
                  gridRow: e.row,
                  background: dim ? "rgba(11, 18, 36, 0.3)" : `radial-gradient(circle at 50% 20%, ${color}1e, #0B1224 85%)`,
                  border: `1px solid ${dim ? "rgba(255,255,255,0.05)" : `${color}55`}`,
                  opacity: dim ? 0.18 : 1,
                  boxShadow: dim ? "none" : `0 0 12px ${color}1a, inset 0 0 10px ${color}12`,
                }}
              >
                {/* Top: Atomic Number */}
                <div className="w-full flex justify-between items-center text-[7px] sm:text-[9px] font-mono text-[var(--muted)] leading-none">
                  <span>{e.number}</span>
                  <span className="text-[6px] text-[var(--muted)] opacity-60 hidden sm:inline">{e.period}</span>
                </div>

                {/* Center: Element Symbol */}
                <div className="my-auto text-center">
                  <span
                    className="font-display font-black text-xs sm:text-base md:text-lg leading-none transition-transform group-hover:scale-110 inline-block"
                    style={{ color, textShadow: `0 0 10px ${color}66` }}
                  >
                    {e.symbol}
                  </span>
                </div>

                {/* Bottom: Name & Mass */}
                <div className="w-full text-center overflow-hidden">
                  <span className="text-[6px] sm:text-[7.5px] text-[#E6F7FF] truncate w-full block leading-none font-sans font-medium">
                    {e.name}
                  </span>
                  <span className="text-[5.5px] sm:text-[6.5px] text-[var(--muted)] font-mono truncate w-full block leading-none mt-0.5 opacity-80">
                    {typeof e.mass === "number" ? e.mass.toFixed(2) : e.mass}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend Spectroscopy Panel */}
      <div className="mt-6 sm:mt-8 glass p-5 sm:p-6 rounded-2xl border border-[rgba(0,245,255,0.14)]">
        <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--cyan)] mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" />
          <span>SPECTROSCOPIC CLASSIFICATION INDEX</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {Object.entries(CATEGORY_LABELS).map(([k, label]) => {
            const c = CATEGORY_COLORS[k] || "#00F5FF";
            return (
              <div
                key={k}
                onClick={() => setFilter(filter === k ? "all" : k)}
                className={`flex items-center gap-2 text-xs font-mono p-2 rounded-lg transition-colors cursor-pointer ${
                  filter === k ? "bg-white/10 text-white" : "text-[var(--muted)] hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor]" style={{ background: c, color: c }} />
                <span className="truncate">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
