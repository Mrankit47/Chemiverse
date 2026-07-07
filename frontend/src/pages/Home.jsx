import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import Atom3D from "@/components/three/Atom3D";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MODULES } from "@/data/chem";

const MARQUEE = [
  "ATOMS", "PERIODIC TABLE", "MOLECULES", "REACTIONS", "BONDING", "ORGANIC",
  "ELECTRONS", "ISOTOPES", "STOICHIOMETRY", "CATALYSIS", "THERMODYNAMICS", "ACIDS & BASES",
];

function Icon({ name, className }) {
  const map = { atom: "Atom", orbit: "Orbit", hexagon: "Hexagon", "flask-conical": "FlaskConical", "test-tubes": "TestTubes", zap: "Zap", sparkles: "Sparkles", trophy: "Trophy" };
  const C = Icons[map[name]] || Icons.Atom;
  return <C className={className} />;
}

export default function Home() {
  return (
    <div className="min-h-screen" data-testid="home-page">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 lg:left-1/2">
          <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}>
            <Suspense fallback={null}>
              <Stars radius={60} depth={40} count={2500} factor={3} fade speed={1} />
              <Atom3D shells={[2, 8, 6]} color="#00F5FF" />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
            </Suspense>
          </Canvas>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="inline-block font-mono text-xs tracking-[0.3em] text-[var(--cyan)] mb-5 px-3 py-1 rounded-full glass">
              INTERACTIVE 3D CHEMISTRY
            </span>
            <h1 className="font-display font-extrabold text-6xl md:text-7xl leading-[0.95] tracking-tight">
              CHEMI<span className="grad-text">VERSE</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--muted)] mt-6 leading-relaxed">
              Explore matter at every scale — from glowing atoms to reacting molecules,
              in a cinematic 3D chemistry universe.
            </p>
            <div className="flex flex-wrap gap-4 mt-9">
              <Link
                to="/periodic-galaxy"
                data-testid="hero-cta-primary"
                className="px-7 py-3.5 rounded-full font-semibold bg-[var(--cyan)] text-black hover:glow-cyan transition-all inline-flex items-center gap-2"
              >
                Enter the Periodic Galaxy <Icons.ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/ai-tutor"
                data-testid="hero-cta-secondary"
                className="px-7 py-3.5 rounded-full font-semibold glass hover:border-[var(--cyan)] transition-all"
              >
                Ask ChemiBot
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--muted)] text-xs font-mono animate-bounce">
          SCROLL ⌄
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee py-6 border-y border-[var(--border)] bg-[var(--surface)]/40">
        <div className="marquee-track font-display font-bold text-2xl text-white/20">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="flex items-center gap-10">{t} <span className="text-[var(--cyan)]">·</span></span>
          ))}
        </div>
      </div>

      {/* MODULES */}
      <section className="max-w-7xl mx-auto px-5 py-24">
        <div className="mb-14 text-center">
          <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">
            Every concept, <span className="grad-text">alive in 3D</span>
          </h2>
          <p className="text-[var(--muted)] mt-4 max-w-xl mx-auto">
            Eight immersive modules that turn abstract chemistry into something you can see, spin and play with.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <Link
                to={m.path}
                data-testid={`module-card-${m.id}`}
                className="hover-lift group block glass rounded-2xl p-6 h-full relative overflow-hidden"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ background: m.accent }}
                />
                <div
                  className="w-12 h-12 rounded-xl grid place-items-center mb-5"
                  style={{ background: `${m.accent}1a`, color: m.accent }}
                >
                  <Icon name={m.icon} className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{m.title}</h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">{m.desc}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium" style={{ color: m.accent }}>
                  Explore <Icons.ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="max-w-7xl mx-auto px-5 pb-10">
        <div className="glass rounded-3xl p-10 md:p-16 text-center relative overflow-hidden glow-purple">
          <div className="absolute inset-0 chem-grid opacity-30" />
          <h2 className="relative font-display font-extrabold text-3xl md:text-5xl">
            Ready to explore the <span className="grad-text">building blocks of everything?</span>
          </h2>
          <Link
            to="/periodic-galaxy"
            data-testid="cta-band-btn"
            className="relative inline-flex mt-8 px-8 py-4 rounded-full font-semibold bg-[var(--cyan)] text-black hover:glow-cyan transition-all"
          >
            Start Exploring
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
