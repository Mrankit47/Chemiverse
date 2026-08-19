import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PageShell({ title, subtitle, accent = "#7CFF3C", children, testId }) {
  return (
    <div className="min-h-screen" data-testid={testId}>
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-white mb-5 glass px-3.5 py-1.5 rounded-full transition-colors w-fit"
          data-testid="back-home"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Universe
        </Link>
        {title && (
          <div className="mb-6 sm:mb-8 fadeup">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[var(--muted)] mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed">
                {subtitle}
              </p>
            )}
            <div
              className="h-1 w-20 sm:w-24 mt-4 sm:mt-5 rounded-full"
              style={{ background: accent, boxShadow: `0 0 20px ${accent}` }}
            />
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
