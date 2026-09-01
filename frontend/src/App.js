import "@/App.css";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SceneBackground from "@/components/three/SceneBackground";
import Home from "@/pages/Home";

// Lazy load all secondary pages — they only download when navigated to
const PeriodicGalaxy = lazy(() => import("@/pages/PeriodicGalaxy"));
const ElementProfile = lazy(() => import("@/pages/ElementProfile"));
const AtomViewer = lazy(() => import("@/pages/AtomViewer"));
const MoleculeViewer = lazy(() => import("@/pages/MoleculeViewer"));
const ReactionSimulator = lazy(() => import("@/pages/ReactionSimulator"));
const VirtualLab = lazy(() => import("@/pages/VirtualLab"));
const Quiz = lazy(() => import("@/pages/Quiz"));
const AITutor = lazy(() => import("@/pages/AITutor"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] px-4">
      <div className="glass-bright rounded-2xl p-6 sm:p-8 max-w-sm w-full border border-[rgba(0,245,255,0.25)] shadow-[0_0_40px_rgba(0,191,255,0.15)] flex flex-col items-center gap-5 text-center">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-2 border-[var(--cyan)]/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-[var(--cyan)] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_var(--cyan)]" />
          <div className="absolute inset-2 border border-[var(--electric-blue)]/40 border-b-transparent rounded-full animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
        </div>
        <div className="space-y-1.5 font-mono">
          <div className="text-xs font-semibold text-[var(--cyan)] tracking-wider">
            ANALYZING MOLECULAR STRUCTURE...
          </div>
          <div className="text-[11px] text-[var(--muted)]">
            INITIALIZING WORKSTATION // LAB-CORE
          </div>
        </div>
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-[rgba(0,245,255,0.1)]">
          <div className="h-full bg-gradient-to-r from-[var(--cyan)] to-[var(--electric-blue)] w-3/4 animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <div className="chem-bg" />
      <SceneBackground />
      <div className="chem-grid" />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/periodic-galaxy" element={<PeriodicGalaxy />} />
            <Route path="/element/:number" element={<ElementProfile />} />
            <Route path="/atom-viewer" element={<AtomViewer />} />
            <Route path="/molecule-viewer" element={<MoleculeViewer />} />
            <Route path="/reaction-simulator" element={<ReactionSimulator />} />
            <Route path="/virtual-lab" element={<VirtualLab />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/ai-tutor" element={<AITutor />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
