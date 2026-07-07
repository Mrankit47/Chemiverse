# ChemiVerse — PRD

## Problem Statement
Build "ChemiVerse", a chemistry equivalent of biosphere-eatr.vercel.app (an immersive 3D biology site). Based on the user's CHEMIVERSE_Master_Documentation_v1.docx: a premium, futuristic, cinematic 3D chemistry learning platform with lots of 3D simulations and models. User instruction: "start building all one by one" — build all modules, production-ready.

## Stack
- Frontend: React 19 + React Router + React Three Fiber (@react-three/fiber, drei, three) + framer-motion + Tailwind
- Backend: FastAPI + MongoDB (motor)
- AI: Claude Sonnet 4.6 via Emergent LLM key (emergentintegrations), SSE streaming
- Design: neon cyan #00F5FF / electric purple #8A2BE2 / chemical orange #FF6B00, bg #050816, fonts Sora + Space Grotesk + Inter + IBM Plex Mono. Space/lab aesthetic per doc.

## Personas
- Students & self-learners exploring chemistry interactively.

## Implemented (2026-07-07)
- Home: 3D hero atom (Stars + orbiting electrons), module grid (8), marquee, CTA
- Periodic Galaxy: all 118 elements (data/elements.json), search + category filters, click → element profile
- Element Profile: 3D Bohr atom, stats, uses, prev/next navigation
- Atom Viewer: featured element picker + slider, animated 3D shells, shell bars
- Molecule Viewer: 8 molecules (water, CO2, methane, ammonia, O2, ethanol, benzene, HCl) as 3D ball-and-stick
- Reaction Simulator: 6 reactions, animated reactant→product transition + energy info (awards XP)
- Virtual Lab: reagent shelf + beaker mixing with observation results (awards XP + achievement)
- Quiz Arena: 12-question pool, scoring, XP submit to backend, results screen
- AI Tutor: ChemiBot streaming chat (Claude Sonnet 4.6), markdown rendering, suggestions
- Progress Hub (Dashboard): XP, level, achievements, quiz history, modules explored
- Backend: /api/tutor/chat (SSE), /api/tutor/history, /api/progress, /api/quiz/submit, /api/leaderboard
- Progress persisted per anonymous localStorage user id (cv_uid). No login.

## Testing
- iteration_1.json: Backend 7/7 pytest pass, Frontend 100% critical flows. No blocking issues.

## Backlog / Next
- P1: Molecule Builder (drag atoms to bond), Crystal/lattice viewer, Organic explorer
- P1: Add user accounts (JWT or Google) to persist across devices; leaderboard UI page
- P2: Story mode / guided learning paths, quests, more molecules & reactions, isotopes tab per element
- P2: Rate limiting on /api/tutor/chat; markdown tables/code in tutor
- Future: AR/VR per doc roadmap
