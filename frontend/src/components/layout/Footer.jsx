import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter } from "lucide-react";
import { MODULES } from "@/data/chem";
import ChemistryLogo from "@/components/common/ChemistryLogo";

export default function Footer() {
  return (
    <footer data-testid="main-footer" className="relative border-t border-[rgba(0,245,255,0.15)] mt-16 sm:mt-24 bg-[#050816]/80 backdrop-blur-lg">
      {/* Top telemetry bar */}
      <div className="border-b border-[rgba(0,245,255,0.1)] py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] font-lab tracking-[0.16em] uppercase text-[var(--muted)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--green)] pulsering" />
            <span className="text-[#E6F7FF] font-semibold">CHEMIVERSE MOLECULAR ENGINE // V2.4.0</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px]">
            <span>STATION: ORBITAL-04</span>
            <span className="hidden sm:inline text-[var(--cyan)]">SPECTROSCOPY: 100% ONLINE</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl glass grid place-items-center border border-[rgba(0,245,255,0.3)] shadow-[0_0_15px_rgba(0,245,255,0.2)] p-1 bg-gradient-to-br from-[#0B1224]/90 to-[#050816]/90">
              <ChemistryLogo className="w-full h-full" showBadge={false} />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-normal text-[#E6F7FF]">
              CHEMI<span className="grad-text">VERSE</span>
            </span>
          </div>
          <p className="text-[var(--muted)] max-w-sm text-xs sm:text-sm leading-relaxed font-sans">
            Next-generation molecular research platform and digital chemistry laboratory.
            Explore 118 elements, simulate high-energy reactions, and manipulate 3D molecular bonds in real-time.
          </p>
          <div className="flex gap-3 mt-5">
            <span className="w-8 h-8 rounded-lg glass grid place-items-center text-[var(--muted)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] transition-colors cursor-pointer border border-[rgba(0,245,255,0.15)]"><Github className="w-4 h-4" /></span>
            <span className="w-8 h-8 rounded-lg glass grid place-items-center text-[var(--muted)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] transition-colors cursor-pointer border border-[rgba(0,245,255,0.15)]"><Twitter className="w-4 h-4" /></span>
          </div>
        </div>
        <div>
          <h4 className="font-lab font-semibold text-xs uppercase tracking-[0.2em] text-[var(--cyan)] mb-4">Simulation Modules</h4>
          <ul className="space-y-2.5">
            {MODULES.slice(0, 4).map((m) => (
              <li key={m.id}>
                <Link to={m.path} className="text-[var(--muted)] hover:text-[#E6F7FF] text-xs font-mono transition-colors flex items-center gap-2">
                  <span className="text-[var(--cyan)] opacity-40">›</span> {m.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-lab font-semibold text-xs uppercase tracking-[0.2em] text-[var(--purple)] mb-4">Research & Tools</h4>
          <ul className="space-y-2.5">
            {MODULES.slice(4).map((m) => (
              <li key={m.id}>
                <Link to={m.path} className="text-[var(--muted)] hover:text-[#E6F7FF] text-xs font-mono transition-colors flex items-center gap-2">
                  <span className="text-[var(--purple)] opacity-40">›</span> {m.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[rgba(0,245,255,0.1)] py-5 text-center text-xs text-[var(--muted)] font-mono">
        © {new Date().getFullYear()} ChemiVerse Research Laboratory · Built for immersive scientific education
      </div>
    </footer>
  );
}
