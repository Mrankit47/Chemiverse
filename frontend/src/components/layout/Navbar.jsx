import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { MODULES } from "@/data/chem";
import ChemistryLogo from "@/components/common/ChemistryLogo";

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
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
        scrolled || open
          ? "bg-[#050816]/95 backdrop-blur-md border-b border-white/10 shadow-sm"
          : "bg-[#050816]/75 backdrop-blur-sm border-b border-white/[0.06]"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-2.5 group">
          <ChemistryLogo
            className="w-8 h-8 transition-transform duration-300 group-hover:scale-105"
            glow={false}
            showBadge={false}
          />
          <span className="font-display font-bold text-xl tracking-tight text-white">
            Chemi<span className="text-cyan-400">verse</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((m) => {
            const active = loc.pathname === m.path;
            return (
              <Link
                key={m.id}
                to={m.path}
                data-testid={`nav-${m.id}`}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-white/10 text-white font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {m.title}
              </Link>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/ai-tutor"
            data-testid="nav-cta"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask ChemiBot</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          data-testid="nav-mobile-toggle"
          aria-label="Toggle navigation menu"
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div
          className="lg:hidden border-b border-white/10 bg-[#050816]/98 backdrop-blur-xl px-4 pt-2 pb-5 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          {MODULES.map((m) => {
            const active = loc.pathname === m.path;
            return (
              <Link
                key={m.id}
                to={m.path}
                data-testid={`nav-mobile-${m.id}`}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-cyan-500/10 text-cyan-400 font-semibold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{m.title}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-white/10">
            <Link
              to="/ai-tutor"
              data-testid="nav-mobile-cta"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask ChemiBot</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
