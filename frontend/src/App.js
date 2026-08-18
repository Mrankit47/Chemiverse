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
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[var(--cyan)] border-t-transparent rounded-full animate-spin" />
        <span className="text-[var(--muted)] text-sm font-mono">Loading module…</span>
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
