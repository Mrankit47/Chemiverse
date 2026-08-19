import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Atom, Menu, X, Sparkles } from "lucide-react";
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

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const links = MODULES.slice(0, 6);

  return (
    <header
      data-testid="main-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open ? "glass border-b border-[var(--border)]" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-2 group z-50">
          <span className="relative">
            <Atom className="w-7 h-7 text-[var(--cyan)] group-hover:rotate-90 transition-transform duration-500" />
          </span>
          <span className="font-display font-extrabold text-xl tracking-tight">
            Chemi<span className="grad-text">Verse</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((m) => (
            <Link
              key={m.id}
              to={m.path}
              data-testid={`nav-${m.id}`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                loc.pathname === m.path
                  ? "text-[var(--cyan)] bg-white/5"
                  : "text-[var(--muted)] hover:text-white"
              }`}
            >
              {m.title}
            </Link>
          ))}
          <Link
            to="/ai-tutor"
            data-testid="nav-cta"
            className="ml-2 px-4 py-2 rounded-full text-sm font-semibold bg-[var(--cyan)] text-black hover:glow-cyan transition-all inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> Ask ChemiBot
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          data-testid="nav-mobile-toggle"
          aria-label="Toggle navigation menu"
          className="lg:hidden p-2 rounded-xl glass text-white z-50 hover:border-[var(--cyan)] transition-colors"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="w-6 h-6 text-[var(--cyan)]" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-[var(--bg)]/95 backdrop-blur-xl border-t border-[var(--border)] overflow-y-auto px-5 py-6 flex flex-col justify-between"
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <div>
            <div className="text-xs uppercase tracking-wider text-[var(--muted)] font-mono mb-3">
              Explore Modules
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MODULES.map((m) => {
                const active = loc.pathname === m.path;
                return (
                  <Link
                    key={m.id}
                    to={m.path}
                    data-testid={`nav-mobile-${m.id}`}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between border ${
                      active
                        ? "border-[var(--cyan)] bg-[var(--cyan)]/10 text-white"
                        : "border-[var(--border)] glass text-[var(--muted)] hover:text-white"
                    }`}
                  >
                    <span>{m.title}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: m.accent }}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border)]">
            <Link
              to="/ai-tutor"
              data-testid="nav-mobile-cta"
              onClick={() => setOpen(false)}
              className="w-full py-4 rounded-full text-base font-semibold bg-[var(--cyan)] text-black hover:glow-cyan transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-5 h-5" /> Ask ChemiBot (AI Tutor)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
