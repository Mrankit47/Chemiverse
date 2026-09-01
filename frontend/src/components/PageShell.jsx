import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PageShell({ title, subtitle, accent = "#00F5FF", children, testId }) {
  return (
    <div className="min-h-screen relative" data-testid={testId}>
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Navigation & Telemetry breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--muted)] hover:text-[#E6F7FF] glass px-3.5 py-1.5 rounded-full border border-[rgba(0,245,255,0.15)] hover:border-[var(--cyan)] transition-all w-fit group shadow-[0_0_10px_rgba(0,245,255,0.05)]"
            data-testid="back-home"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[var(--cyan)]" />
            <span>RETURN TO COMMAND CENTER</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-[var(--muted)] glass px-3 py-1 rounded-full border border-[rgba(0,245,255,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] pulsering" />
            <span>WORKSTATION // READY</span>
          </div>
        </div>

        {title && (
          <div className="mb-6 sm:mb-8 fadeup">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-6 bg-[var(--cyan)]/60" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--cyan)]">
                RESEARCH MODULE
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight text-[#E6F7FF]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[var(--muted)] mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed">
                {subtitle}
              </p>
            )}
            <div className="flex items-center gap-2 mt-4 sm:mt-5">
              <div
                className="h-1 w-20 sm:w-28 rounded-full shadow-[0_0_15px_currentColor]"
                style={{ background: accent, color: accent }}
              />
              <div className="h-1 w-2 rounded-full bg-white/20" />
              <div className="h-1 w-2 rounded-full bg-white/10" />
            </div>
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
