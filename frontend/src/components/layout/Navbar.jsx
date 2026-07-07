import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Atom, Menu, X } from "lucide-react";
import { MODULES } from "@/data/chem";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [loc.pathname]);

  const links = MODULES.slice(0, 6);

  return (
    <header
      data-testid="main-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-[var(--border)]" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-2 group">
          <span className="relative">
            <Atom className="w-7 h-7 text-[var(--cyan)] group-hover:rotate-90 transition-transform duration-500" />
          </span>
          <span className="font-display font-extrabold text-xl tracking-tight">
            Chemi<span className="grad-text">Verse</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((m) => (
            <Link
              key={m.id}
              to={m.path}
              data-testid={`nav-${m.id}`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                loc.pathname === m.path
                  ? "text-[var(--cyan)]"
                  : "text-[var(--muted)] hover:text-white"
              }`}
            >
              {m.title}
            </Link>
          ))}
          <Link
            to="/ai-tutor"
            data-testid="nav-cta"
            className="ml-2 px-4 py-2 rounded-full text-sm font-semibold bg-[var(--cyan)] text-black hover:glow-cyan transition-all"
          >
            Ask ChemiBot
          </Link>
        </div>

        <button
          data-testid="nav-mobile-toggle"
          className="lg:hidden text-white"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden glass border-t border-[var(--border)] px-5 py-4 grid grid-cols-2 gap-2">
          {MODULES.map((m) => (
            <Link
              key={m.id}
              to={m.path}
              data-testid={`nav-mobile-${m.id}`}
              className="px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:text-white hover:bg-white/5"
            >
              {m.title}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
