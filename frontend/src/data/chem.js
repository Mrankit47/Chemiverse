// Category colors for periodic table + atom rendering
export const CATEGORY_COLORS = {
  alkali: "#FF9E1B",
  alkaline: "#FFD23F",
  transition: "#3FA9FF",
  "post-transition": "#1FE3C2",
  metalloid: "#B026FF",
  nonmetal: "#7CFF3C",
  halogen: "#c8ff4d",
  noble: "#FF3FA4",
  lanthanide: "#c084fc",
  actinide: "#f0728c",
  unknown: "#7d8f83",
};

export const CATEGORY_LABELS = {
  alkali: "Alkali Metal",
  alkaline: "Alkaline Earth",
  transition: "Transition Metal",
  "post-transition": "Post-transition Metal",
  metalloid: "Metalloid",
  nonmetal: "Nonmetal",
  halogen: "Halogen",
  noble: "Noble Gas",
  lanthanide: "Lanthanide",
  actinide: "Actinide",
  unknown: "Unknown",
};

// CPK-style atom colors + radii for molecule rendering
export const ATOM_STYLE = {
  H: { color: "#e8eefc", r: 0.30 },
  C: { color: "#2b2b33", r: 0.52 },
  O: { color: "#ff4d4d", r: 0.48 },
  N: { color: "#3b6bff", r: 0.50 },
  Cl: { color: "#4ade80", r: 0.58 },
  Na: { color: "#8A2BE2", r: 0.62 },
  S: { color: "#facc15", r: 0.56 },
  P: { color: "#FF6B00", r: 0.56 },
  F: { color: "#7df9a8", r: 0.42 },
};

// Extra descriptive info for notable elements (fallback text generated otherwise)
export const ELEMENT_INFO = {
  H: { summary: "The lightest and most abundant element in the universe. Fuels stars and forms water with oxygen.", uses: ["Rocket fuel", "Ammonia synthesis", "Fuel cells"], discovered: "1766, Henry Cavendish" },
  He: { summary: "An inert noble gas, second most abundant element. Lighter than air and never freezes at normal pressure.", uses: ["Balloons & airships", "MRI cooling", "Deep-sea breathing mixes"], discovered: "1868, Janssen & Lockyer" },
  C: { summary: "The backbone of all known life. Forms diamonds, graphite, and millions of organic compounds.", uses: ["Steel making", "Diamonds", "Organic chemistry"], discovered: "Ancient" },
  N: { summary: "Makes up 78% of Earth's atmosphere. Essential for proteins and DNA.", uses: ["Fertilizers", "Refrigerant", "Food packaging"], discovered: "1772, Daniel Rutherford" },
  O: { summary: "Vital for respiration and combustion. Third most abundant element in the universe.", uses: ["Breathing", "Steel making", "Rocket oxidizer"], discovered: "1774, Joseph Priestley" },
  Na: { summary: "A soft, highly reactive alkali metal that explodes in water. Key to nerve signals as Na⁺ ions.", uses: ["Table salt", "Street lamps", "Coolant in reactors"], discovered: "1807, Humphry Davy" },
  Fe: { summary: "The most used metal on Earth and the core of our planet. Central to hemoglobin in blood.", uses: ["Steel & construction", "Blood (hemoglobin)", "Magnets"], discovered: "Ancient" },
  Au: { summary: "A dense, unreactive precious metal prized for millennia. Excellent conductor that never tarnishes.", uses: ["Jewelry", "Electronics", "Currency reserves"], discovered: "Ancient" },
  Cl: { summary: "A toxic yellow-green halogen. Powerful disinfectant that keeps water safe.", uses: ["Water treatment", "PVC plastic", "Bleach"], discovered: "1774, Carl Wilhelm Scheele" },
  U: { summary: "A heavy radioactive metal used to power nuclear reactors and weapons.", uses: ["Nuclear fuel", "Radiometric dating", "Armor"], discovered: "1789, Martin Klaproth" },
  Ne: { summary: "A noble gas famous for its bright red-orange glow in signs.", uses: ["Neon signs", "High-voltage indicators", "Cryogenics"], discovered: "1898, Ramsay & Travers" },
};

// ---------------- Molecules (ball & stick, 3D coords) ----------------
export const MOLECULES = [
  {
    id: "water", name: "Water", formula: "H₂O", category: "Inorganic",
    fact: "Polar molecule with a 104.5° bond angle — the reason ice floats.",
    atoms: [
      { el: "O", pos: [0, 0, 0] },
      { el: "H", pos: [0.76, 0.59, 0] },
      { el: "H", pos: [-0.76, 0.59, 0] },
    ],
    bonds: [[0, 1, 1], [0, 2, 1]],
  },
  {
    id: "co2", name: "Carbon Dioxide", formula: "CO₂", category: "Inorganic",
    fact: "Linear molecule and key greenhouse gas exhaled by every breath.",
    atoms: [
      { el: "C", pos: [0, 0, 0] },
      { el: "O", pos: [1.16, 0, 0] },
      { el: "O", pos: [-1.16, 0, 0] },
    ],
    bonds: [[0, 1, 2], [0, 2, 2]],
  },
  {
    id: "methane", name: "Methane", formula: "CH₄", category: "Organic",
    fact: "The simplest hydrocarbon with a perfect tetrahedral shape (109.5°).",
    atoms: [
      { el: "C", pos: [0, 0, 0] },
      { el: "H", pos: [0.63, 0.63, 0.63] },
      { el: "H", pos: [-0.63, -0.63, 0.63] },
      { el: "H", pos: [-0.63, 0.63, -0.63] },
      { el: "H", pos: [0.63, -0.63, -0.63] },
    ],
    bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]],
  },
  {
    id: "ammonia", name: "Ammonia", formula: "NH₃", category: "Inorganic",
    fact: "Trigonal pyramidal molecule central to fertilizer production.",
    atoms: [
      { el: "N", pos: [0, 0.3, 0] },
      { el: "H", pos: [0.94, -0.2, 0] },
      { el: "H", pos: [-0.47, -0.2, 0.82] },
      { el: "H", pos: [-0.47, -0.2, -0.82] },
    ],
    bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]],
  },
  {
    id: "oxygen", name: "Oxygen Gas", formula: "O₂", category: "Inorganic",
    fact: "A diatomic double bond — the molecule that keeps you alive.",
    atoms: [
      { el: "O", pos: [0.6, 0, 0] },
      { el: "O", pos: [-0.6, 0, 0] },
    ],
    bonds: [[0, 1, 2]],
  },
  {
    id: "ethanol", name: "Ethanol", formula: "C₂H₅OH", category: "Organic",
    fact: "The alcohol in beverages and a renewable biofuel.",
    atoms: [
      { el: "C", pos: [-1.2, 0, 0] },
      { el: "C", pos: [0.05, 0.6, 0] },
      { el: "O", pos: [1.15, -0.3, 0] },
      { el: "H", pos: [2.0, 0.2, 0] },
      { el: "H", pos: [-2.0, 0.7, 0] },
      { el: "H", pos: [-1.3, -0.7, 0.85] },
      { el: "H", pos: [-1.3, -0.7, -0.85] },
      { el: "H", pos: [0.15, 1.3, 0.85] },
      { el: "H", pos: [0.15, 1.3, -0.85] },
    ],
    bonds: [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 4, 1], [0, 5, 1], [0, 6, 1], [1, 7, 1], [1, 8, 1]],
  },
  {
    id: "benzene", name: "Benzene", formula: "C₆H₆", category: "Aromatic",
    fact: "A ring of six carbons with delocalized electrons — the icon of aromatic chemistry.",
    atoms: (() => {
      const a = []; const R = 1.4;
      for (let i = 0; i < 6; i++) {
        const t = (i / 6) * Math.PI * 2;
        a.push({ el: "C", pos: [Math.cos(t) * R, Math.sin(t) * R, 0] });
      }
      for (let i = 0; i < 6; i++) {
        const t = (i / 6) * Math.PI * 2;
        a.push({ el: "H", pos: [Math.cos(t) * (R + 1), Math.sin(t) * (R + 1), 0] });
      }
      return a;
    })(),
    bonds: (() => {
      const b = [];
      for (let i = 0; i < 6; i++) b.push([i, (i + 1) % 6, i % 2 === 0 ? 2 : 1]);
      for (let i = 0; i < 6; i++) b.push([i, i + 6, 1]);
      return b;
    })(),
  },
  {
    id: "hcl", name: "Hydrogen Chloride", formula: "HCl", category: "Inorganic",
    fact: "Dissolves in water to form hydrochloric acid, found in your stomach.",
    atoms: [
      { el: "Cl", pos: [0.7, 0, 0] },
      { el: "H", pos: [-0.7, 0, 0] },
    ],
    bonds: [[0, 1, 1]],
  },
];

// ---------------- Reactions ----------------
export const REACTIONS = [
  {
    id: "combustion", name: "Combustion of Methane", type: "Combustion",
    equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
    reactants: ["CH₄", "2 O₂"], products: ["CO₂", "2 H₂O"],
    energy: "exothermic", color: "#FF9E1B",
    desc: "Methane burns in oxygen releasing large amounts of heat and light — the reaction that powers gas stoves.",
  },
  {
    id: "neutralization", name: "Acid–Base Neutralization", type: "Neutralization",
    equation: "HCl + NaOH → NaCl + H₂O",
    reactants: ["HCl", "NaOH"], products: ["NaCl", "H₂O"],
    energy: "exothermic", color: "#3FA9FF",
    desc: "A strong acid meets a strong base, producing salt and water while releasing heat.",
  },
  {
    id: "synthesis", name: "Ammonia Synthesis (Haber)", type: "Synthesis",
    equation: "N₂ + 3H₂ → 2NH₃",
    reactants: ["N₂", "3 H₂"], products: ["2 NH₃"],
    energy: "exothermic", color: "#B026FF",
    desc: "The Haber process fixes atmospheric nitrogen into ammonia, feeding billions through fertilizers.",
  },
  {
    id: "photosynthesis", name: "Photosynthesis", type: "Endothermic",
    equation: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
    reactants: ["6 CO₂", "6 H₂O"], products: ["C₆H₁₂O₆", "6 O₂"],
    energy: "endothermic", color: "#7CFF3C",
    desc: "Plants capture light energy to convert carbon dioxide and water into glucose and oxygen.",
  },
  {
    id: "rusting", name: "Rusting of Iron", type: "Oxidation",
    equation: "4Fe + 3O₂ → 2Fe₂O₃",
    reactants: ["4 Fe", "3 O₂"], products: ["2 Fe₂O₃"],
    energy: "exothermic", color: "#facc15",
    desc: "Iron slowly reacts with oxygen and moisture, forming reddish iron oxide — corrosion in action.",
  },
  {
    id: "electrolysis", name: "Electrolysis of Water", type: "Decomposition",
    equation: "2H₂O → 2H₂ + O₂",
    reactants: ["2 H₂O"], products: ["2 H₂", "O₂"],
    energy: "endothermic", color: "#3b6bff",
    desc: "An electric current splits water into hydrogen and oxygen gas — a route to clean fuel.",
  },
];

// ---------------- Quiz ----------------
export const QUIZ = [
  { q: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], answer: 2 },
  { q: "How many protons does a Carbon atom have?", options: ["6", "12", "8", "14"], answer: 0 },
  { q: "Which gas makes up ~78% of Earth's atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"], answer: 1 },
  { q: "What is the pH of a neutral solution?", options: ["0", "14", "7", "1"], answer: 2 },
  { q: "Which element is a noble gas?", options: ["Sodium", "Neon", "Chlorine", "Iron"], answer: 1 },
  { q: "The bond angle in a water molecule is approximately:", options: ["90°", "104.5°", "120°", "180°"], answer: 1 },
  { q: "What type of bond forms between Na and Cl in salt?", options: ["Covalent", "Metallic", "Ionic", "Hydrogen"], answer: 2 },
  { q: "Which is the lightest element?", options: ["Helium", "Hydrogen", "Lithium", "Carbon"], answer: 1 },
  { q: "CH₄ is the formula for:", options: ["Methanol", "Methane", "Ethane", "Ammonia"], answer: 1 },
  { q: "What is Avogadro's number (order of magnitude)?", options: ["10²³", "10¹⁰", "10⁶", "10¹⁵"], answer: 0 },
  { q: "Which process converts liquid directly to gas?", options: ["Condensation", "Sublimation", "Vaporization", "Freezing"], answer: 2 },
  { q: "The most electronegative element is:", options: ["Oxygen", "Chlorine", "Fluorine", "Nitrogen"], answer: 2 },
];

// Module registry used by the home grid + dashboard
export const MODULES = [
  { id: "periodic", title: "Periodic Galaxy", path: "/periodic-galaxy", icon: "atom", desc: "118 elements as glowing planets. Click any to open its 3D profile.", accent: "#7CFF3C" },
  { id: "atom", title: "Atom Viewer", path: "/atom-viewer", icon: "orbit", desc: "Explore atomic structure with animated electron shells in 3D.", accent: "#B026FF" },
  { id: "molecule", title: "Molecule Viewer", path: "/molecule-viewer", icon: "hexagon", desc: "Rotate ball-and-stick models of real molecules.", accent: "#FF9E1B" },
  { id: "reaction", title: "Reaction Simulator", path: "/reaction-simulator", icon: "flask-conical", desc: "Watch reactants transform into products with energy flow.", accent: "#1FE3C2" },
  { id: "lab", title: "Virtual Lab", path: "/virtual-lab", icon: "test-tubes", desc: "Mix reagents and observe color changes safely.", accent: "#FF3FA4" },
  { id: "quiz", title: "Quiz Arena", path: "/quiz", icon: "zap", desc: "Test your chemistry knowledge and earn XP.", accent: "#FFD23F" },
  { id: "tutor", title: "AI Tutor", path: "/ai-tutor", icon: "sparkles", desc: "Ask ChemiBot anything about chemistry, 24/7.", accent: "#3FA9FF" },
  { id: "dashboard", title: "Progress Hub", path: "/dashboard", icon: "trophy", desc: "Track XP, achievements and completed modules.", accent: "#B026FF" },
];
