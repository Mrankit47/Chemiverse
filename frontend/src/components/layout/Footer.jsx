import React from "react";
import { Link } from "react-router-dom";
import { Atom, Github, Twitter } from "lucide-react";
import { MODULES } from "@/data/chem";

export default function Footer() {
  return (
    <footer data-testid="main-footer" className="relative border-t border-[var(--border)] mt-24">
      <div className="max-w-7xl mx-auto px-5 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Atom className="w-7 h-7 text-[var(--cyan)]" />
            <span className="font-display font-extrabold text-xl">
              Chemi<span className="grad-text">Verse</span>
            </span>
          </div>
          <p className="text-[var(--muted)] max-w-sm leading-relaxed">
            An immersive 3D chemistry universe — explore atoms, molecules and reactions
            through cinematic, interactive simulations.
          </p>
          <div className="flex gap-3 mt-5">
            <span className="w-9 h-9 rounded-full glass grid place-items-center hover:text-[var(--cyan)] cursor-pointer"><Github className="w-4 h-4" /></span>
            <span className="w-9 h-9 rounded-full glass grid place-items-center hover:text-[var(--cyan)] cursor-pointer"><Twitter className="w-4 h-4" /></span>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Explore</h4>
          <ul className="space-y-2">
            {MODULES.slice(0, 4).map((m) => (
              <li key={m.id}>
                <Link to={m.path} className="text-[var(--muted)] hover:text-[var(--cyan)] text-sm">{m.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Learn</h4>
          <ul className="space-y-2">
            {MODULES.slice(4).map((m) => (
              <li key={m.id}>
                <Link to={m.path} className="text-[var(--muted)] hover:text-[var(--cyan)] text-sm">{m.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-5 text-center text-xs text-[var(--muted)] font-mono">
        © {new Date().getFullYear()} ChemiVerse · Built for immersive learning
      </div>
    </footer>
  );
}
