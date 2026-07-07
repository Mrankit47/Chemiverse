import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import PeriodicGalaxy from "@/pages/PeriodicGalaxy";
import ElementProfile from "@/pages/ElementProfile";
import AtomViewer from "@/pages/AtomViewer";
import MoleculeViewer from "@/pages/MoleculeViewer";
import ReactionSimulator from "@/pages/ReactionSimulator";
import VirtualLab from "@/pages/VirtualLab";
import Quiz from "@/pages/Quiz";
import AITutor from "@/pages/AITutor";
import Dashboard from "@/pages/Dashboard";

function App() {
  return (
    <div className="App">
      <div className="chem-bg" />
      <div className="chem-grid" />
      <BrowserRouter>
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
      </BrowserRouter>
    </div>
  );
}

export default App;
