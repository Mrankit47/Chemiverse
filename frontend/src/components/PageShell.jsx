import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PageShell({ title, subtitle, accent = "#00F5FF", children, testId }) {
  return (
    <div className="min-h-screen" data-testid={testId}>
      <Navbar />
      <main className="pt-24 pb-10 max-w-7xl mx-auto px-5">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-white mb-6" data-testid="back-home">
          <ChevronLeft className="w-4 h-4" /> Back to Universe
        </Link>
        {title && (
          <div className="mb-8 fadeup">
            <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">
              {title}
            </h1>
            {subtitle && <p className="text-[var(--muted)] mt-3 max-w-2xl text-lg">{subtitle}</p>}
            <div className="h-1 w-24 mt-5 rounded-full" style={{ background: accent, boxShadow: `0 0 20px ${accent}` }} />
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
