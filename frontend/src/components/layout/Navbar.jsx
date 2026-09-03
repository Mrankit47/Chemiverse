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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-[#050816]/90 backdrop-blur-xl border-b border-[rgba(0,245,255,0.18)] shadow-[0_4px_30px_rgba(5,8,22,0.8)]"
          : "bg-[#050816]/40 backdrop-blur-md border-b border-[rgba(0,245,255,0.08)]"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Laboratory Brand Logo */}
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-3 group z-50">
          <div className="relative w-10 h-10 rounded-2xl glass grid place-items-center border border-[rgba(0,245,255,0.35)] shadow-[0_0_20px_rgba(0,245,255,0.2)] group-hover:border-[var(--cyan)] group-hover:shadow-[0_0_25px_rgba(0,245,255,0.4)] transition-all p-1 bg-gradient-to-br from-[#0B1224]/90 to-[#050816]/90">
            <ChemistryLogo className="w-full h-full" showBadge={true} />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl sm:text-2xl tracking-normal leading-none text-[#E6F7FF]">
              CHEMI<span className="grad-text">VERSE</span>
            </span>
            <span className="font-lab text-[10px] tracking-[0.24em] text-[var(--cyan)] uppercase font-semibold opacity-90 mt-0.5">
              LABORATORY // V2.4
            </span>
          </div>
        </Link>

        {/* Desktop Scientific Control Panel Links */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full glass border border-[rgba(0,245,255,0.12)]">
          {links.map((m) => {
            const active = loc.pathname === m.path;
            return (
              <Link
                key={m.id}
                to={m.path}
                data-testid={`nav-${m.id}`}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-lab uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 ${
                  active
                    ? "text-[#E6F7FF] bg-[rgba(0,245,255,0.12)] border border-[rgba(0,245,255,0.4)] shadow-[0_0_16px_rgba(0,245,255,0.2)]"
                    : "text-[var(--muted)] hover:text-[#E6F7FF] hover:bg-white/5 border border-transparent"
                }`}
              >
                {active && <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] shadow-[0_0_8px_var(--cyan)]" />}
                <span>{m.title}</span>
              </Link>
            );
          })}
        </div>

        {/* Action Button & Status Telemetry */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full glass-subtle text-[11px] font-lab tracking-[0.16em] text-[var(--muted)] border border-[rgba(0,245,255,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-ping" />
            <span className="text-[var(--text)]">CORE: ONLINE</span>
          </div>
          <Link
            to="/ai-tutor"
            data-testid="nav-cta"
            className="px-4 py-2 rounded-full text-xs font-lab font-bold tracking-wider uppercase bg-[rgba(0,191,255,0.15)] text-[var(--cyan)] border border-[rgba(0,245,255,0.35)] hover:bg-[var(--cyan)] hover:text-black hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> ASK CHEMIBOT
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          data-testid="nav-mobile-toggle"
          aria-label="Toggle navigation menu"
          className="lg:hidden p-2.5 rounded-xl glass text-[#E6F7FF] z-50 border border-[rgba(0,245,255,0.2)] hover:border-[var(--cyan)] transition-colors"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="w-5 h-5 text-[var(--cyan)]" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-[#050816]/98 backdrop-blur-2xl border-t border-[rgba(0,245,255,0.2)] overflow-y-auto px-5 py-6 flex flex-col justify-between"
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-[0.24em] text-[var(--cyan)] font-lab font-semibold">
                LABORATORY MODULES
              </span>
              <span className="font-lab text-xs tracking-wider text-[var(--green)] font-semibold">SYS.READY</span>
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
                    className={`px-4 py-3.5 rounded-xl text-xs font-lab uppercase tracking-wider font-medium transition-all flex items-center justify-between border ${
                      active
                        ? "border-[var(--cyan)] bg-[rgba(0,245,255,0.12)] text-white shadow-[0_0_16px_rgba(0,245,255,0.2)]"
                        : "border-[rgba(0,245,255,0.12)] glass text-[var(--muted)] hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" />}
                      <span>{m.title}</span>
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                      style={{ background: m.accent, color: m.accent }}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[rgba(0,245,255,0.14)]">
            <Link
              to="/ai-tutor"
              data-testid="nav-mobile-cta"
              onClick={() => setOpen(false)}
              className="w-full py-3.5 rounded-full text-xs font-lab font-bold tracking-wider uppercase bg-[var(--cyan)] text-black hover:glow-cyan transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,245,255,0.3)]"
            >
              <Sparkles className="w-4 h-4" /> LAUNCH AI RESEARCH TUTOR
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
