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

const ICON_MAP = { atom: Atom, orbit: Orbit, hexagon: Hexagon, "flask-conical": FlaskConical, "test-tubes": TestTubes, zap: Zap, sparkles: Sparkles, trophy: Trophy };
function Icon({ name, className }) {
  const C = ICON_MAP[name] || Atom;
  return <C className={className} />;
}

export default function Home() {
  return (
    <div className="min-h-screen" data-testid="home-page">
      <Navbar />

      {/* HERO — 3D chemistry lab */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 md:left-[42%]">
          <Canvas camera={{ position: [0, 1.6, 6.5], fov: 46 }} dpr={1} gl={{ antialias: false, powerPreference: "low-power" }}>
            <Suspense fallback={null}>
              <LabScene />
              <OrbitControls enableZoom={false} enablePan={false} target={[0, 0.9, 0]} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 2.05} />
            </Suspense>
          </Canvas>
        </div>
        {/* left fade so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/70 to-transparent md:to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-[var(--cyan)] mb-5 px-3 py-1.5 rounded-full glass">
              <span className="w-2 h-2 rounded-full bg-[var(--cyan)] pulsering" /> INTERACTIVE 3D CHEMISTRY LAB
            </span>
            <h1 className="font-display font-extrabold text-6xl md:text-7xl leading-[0.92] tracking-tight">
              CHEMI<span className="grad-text">VERSE</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--muted)] mt-6 leading-relaxed">
              Step into a glowing virtual laboratory. Mix reactions, spin molecules and
              explore all 118 elements — chemistry you can actually see.
            </p>
            <div className="flex flex-wrap gap-4 mt-9">
              <Link
                to="/virtual-lab"
                data-testid="hero-cta-primary"
                className="px-7 py-3.5 rounded-full font-semibold bg-[var(--cyan)] text-black hover:glow-cyan transition-all inline-flex items-center gap-2"
              >
                Enter the Lab <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/periodic-galaxy"
                data-testid="hero-cta-secondary"
                className="px-7 py-3.5 rounded-full font-semibold glass hover:border-[var(--cyan)] transition-all"
              >
                Periodic Galaxy
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--muted)] text-xs font-mono animate-bounce">
          SCROLL ⌄
        </div>
      </section>

      {/* MODULES — the only content section, everything else lives in the navbar */}
      <section className="max-w-7xl mx-auto px-5 py-24">
        <div className="mb-14">
          <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">
            Explore the <span className="grad-text">universe</span>
          </h2>
          <p className="text-[var(--muted)] mt-4 max-w-xl">
            Eight immersive modules — pick any door and dive into interactive 3D chemistry.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                className="hover-lift group block glass rounded-2xl p-6 h-full relative overflow-hidden"
              >
                <div
                  className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-3xl opacity-20 group-hover:opacity-45 transition-opacity"
                  style={{ background: m.accent }}
                />
                <div className="w-12 h-12 rounded-xl grid place-items-center mb-5" style={{ background: `${m.accent}1f`, color: m.accent }}>
                  <Icon name={m.icon} className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{m.title}</h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">{m.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-5 pb-10">
        <div className="glass rounded-3xl p-10 md:p-16 text-center relative overflow-hidden glow-purple">
          <div className="absolute inset-0 chem-grid opacity-30" />
          <h2 className="relative font-display font-extrabold text-3xl md:text-5xl">
            Ready to run your first <span className="grad-text">reaction?</span>
          </h2>
          <Link
            to="/reaction-simulator"
            data-testid="cta-band-btn"
            className="relative inline-flex mt-8 px-8 py-4 rounded-full font-semibold bg-[var(--cyan)] text-black hover:glow-cyan transition-all"
          >
            Launch Reaction Simulator
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
