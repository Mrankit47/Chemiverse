import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { Atom, Orbit, Hexagon, FlaskConical, TestTubes, Zap, Sparkles, Trophy, ArrowRight } from "lucide-react";
import LabScene from "@/components/three/LabScene";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MODULES } from "@/data/chem";

const ICONS = {
  atom: Atom,
  orbit: Orbit,
  hexagon: Hexagon,
  "flask-conical": FlaskConical,
  "test-tubes": TestTubes,
  zap: Zap,
  sparkles: Sparkles,
  trophy: Trophy,
};

function Icon({ name, className = "w-6 h-6" }) {
  const Comp = ICONS[name] || Atom;
  return <Comp className={className} />;
}

const MODULE_CODES = {
  periodic: "MOD-01 // TABLE",
  atom: "MOD-02 // ATOM",
  molecule: "MOD-03 // BOND",
  reaction: "MOD-04 // REACT",
  lab: "MOD-05 // SYNTH",
  quiz: "MOD-06 // CERT",
  tutor: "MOD-07 // NEURAL",
  dashboard: "MOD-08 // HUB",
};

export default function Home() {
  return (
    <div className="min-h-screen" data-testid="home-page">
      <Navbar />

      {/* HERO — 3D chemistry lab */}
      <section className="relative min-h-[92vh] md:min-h-screen flex items-center overflow-hidden pt-24 pb-16 md:py-0">
        <div className="absolute inset-0 md:left-[40%] pointer-events-none md:pointer-events-auto opacity-65 md:opacity-100">
          <Canvas camera={{ position: [0, 1.6, 6.5], fov: 46 }} dpr={1} gl={{ antialias: false, powerPreference: "low-power" }}>
            <Suspense fallback={null}>
              <LabScene />
              <OrbitControls enableZoom={false} enablePan={false} target={[0, 0.9, 0]} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 2.05} />
            </Suspense>
          </Canvas>
        </div>
        {/* left gradient fade for high text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#050816] via-[#050816]/85 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            {/* Scientific HUD status badge */}
            <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[var(--cyan)] mb-4 sm:mb-5 px-3.5 py-1.5 rounded-full glass border border-[rgba(0,245,255,0.25)] shadow-[0_0_15px_rgba(0,245,255,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[var(--cyan)] pulsering" />
              <span>ADVANCED MOLECULAR RESEARCH LAB</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl leading-[1.04] sm:leading-[0.94] tracking-tight text-[#E6F7FF]">
              Explore the <br className="hidden sm:inline" />
              <span className="grad-text">Molecular World</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] mt-4 sm:mt-6 leading-relaxed font-sans">
              Discover elements, molecules, reactions, and the science behind them. Step into a next-generation
              virtual laboratory with live 3D spectroscopy and reaction simulations.
            </p>

            {/* Scientific Flow Stepper: Atoms -> Molecules -> Reactions -> Discovery */}
            <div className="flex items-center gap-1.5 sm:gap-2 my-6 sm:my-7 font-mono text-[10px] sm:text-xs text-[var(--muted)] glass-subtle px-3 sm:px-4 py-2 rounded-xl border border-[rgba(0,245,255,0.12)] w-fit flex-wrap">
              <span className="text-[var(--cyan)] font-semibold">ATOMS</span>
              <span className="text-[rgba(0,245,255,0.4)]">→</span>
              <span className="text-[var(--electric-blue)] font-semibold">MOLECULES</span>
              <span className="text-[rgba(0,245,255,0.4)]">→</span>
              <span className="text-[var(--green)] font-semibold">REACTIONS</span>
              <span className="text-[rgba(0,245,255,0.4)]">→</span>
              <span className="text-[#E6F7FF] font-semibold">DISCOVERY</span>
            </div>

            {/* Futuristic CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
              <Link
                to="/virtual-lab"
                data-testid="hero-cta-primary"
                className="px-7 py-3.5 rounded-full font-mono text-xs sm:text-sm font-semibold bg-[var(--cyan)] text-black hover:glow-cyan transition-all inline-flex items-center justify-center gap-2 text-center shadow-[0_0_25px_rgba(0,245,255,0.35)]"
              >
                ENTER CHEMISTRY LAB <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/periodic-galaxy"
                data-testid="hero-cta-secondary"
                className="px-7 py-3.5 rounded-full font-mono text-xs sm:text-sm font-semibold glass border border-[rgba(0,245,255,0.25)] hover:border-[var(--cyan)] hover:bg-[rgba(0,245,255,0.08)] text-[#E6F7FF] transition-all text-center justify-center inline-flex items-center shadow-[0_0_15px_rgba(0,245,255,0.08)]"
              >
                PERIODIC GALAXY
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--muted)] text-[10px] font-mono tracking-widest animate-bounce">
          [ SCROLL TO ACCESS WORKSTATIONS ] ⌄
        </div>
      </section>

      {/* MODULES — 8 immersive modules */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-px w-8 bg-[var(--cyan)]/60" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--cyan)]">
              RESEARCH WORKSTATIONS
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#E6F7FF]">
            Explore the <span className="grad-text">Universe</span>
          </h2>
          <p className="text-[var(--muted)] mt-3 sm:mt-4 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed">
            Eight specialized scientific workstations — select any module to launch interactive real-time 3D simulations.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
            >
              <Link
                to={m.path}
                data-testid={`module-card-${m.id}`}
                className="hover-lift group block glass rounded-2xl p-5 sm:p-6 h-full relative overflow-hidden border border-[rgba(0,245,255,0.14)] hover:border-[var(--cyan)] transition-all"
              >
                {/* Backlight glow */}
                <div
                  className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-3xl opacity-15 group-hover:opacity-40 transition-opacity"
                  style={{ background: m.accent }}
                />

                {/* Tech ID Tag */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[var(--muted)] mb-4">
                  <span className="text-[var(--cyan)]">{MODULE_CODES[m.id] || "MOD-00"}</span>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.accent }} />
                </div>

                <div
                  className="w-12 h-12 rounded-xl grid place-items-center mb-4 sm:mb-5 border border-[rgba(0,245,255,0.2)] shadow-[0_0_15px_rgba(0,245,255,0.1)] group-hover:scale-105 transition-transform"
                  style={{ background: `${m.accent}1f`, color: m.accent }}
                >
                  <Icon name={m.icon} className="w-6 h-6" />
                </div>

                <h3 className="font-display font-bold text-base sm:text-lg mb-2 text-[#E6F7FF] group-hover:text-[var(--cyan)] transition-colors">
                  {m.title}
                </h3>
                <p className="text-[var(--muted)] text-xs sm:text-sm leading-relaxed font-sans">
                  {m.desc}
                </p>

                <div className="mt-4 pt-3 border-t border-[rgba(0,245,255,0.08)] flex items-center justify-between text-[11px] font-mono text-[var(--muted)] group-hover:text-[var(--cyan)]">
                  <span>LAUNCH MODULE</span>
                  <span>→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* REACTION CHAMBER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="glass rounded-3xl p-7 sm:p-12 md:p-16 text-center relative overflow-hidden border border-[rgba(0,245,255,0.25)] shadow-[0_0_50px_rgba(0,191,255,0.15)]">
          <div className="absolute inset-0 chem-grid opacity-25" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[var(--cyan)] mb-3 sm:mb-4 px-3 py-1 rounded-full glass border border-[rgba(0,245,255,0.2)]">
              HIGH-ENERGY REACTION CHAMBER
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl text-[#E6F7FF]">
              Ready to run your first <span className="grad-text">reaction?</span>
            </h2>
            <p className="text-[var(--muted)] text-xs sm:text-sm md:text-base mt-3 sm:mt-4 leading-relaxed font-sans">
              Test chemical kinetics, exothermic combustions, and molecular bonding transformations under virtual laboratory conditions.
            </p>
            <Link
              to="/reaction-simulator"
              data-testid="cta-band-btn"
              className="relative inline-flex mt-6 sm:mt-8 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-mono text-xs sm:text-sm font-semibold bg-[var(--cyan)] text-black hover:glow-cyan transition-all text-center justify-center shadow-[0_0_25px_rgba(0,245,255,0.4)]"
            >
              LAUNCH REACTION SIMULATOR →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
