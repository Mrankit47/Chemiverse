import React from "react";

/**
 * ChemistryLogo — Precision Scientific Chemistry Laboratory Brand Emblem
 * Features:
 * - Geometric Hexagonal Benzene Ring (C6H6 aromatic carbon ring)
 * - Volumetric Erlenmeyer reaction flask with graduated measurement indicators
 * - Glowing bioluminescent / chemiluminescent liquid with effervescent bubbles
 * - Atomic orbital trajectories with valency electrons
 * - Interactive hover spin and chemical reaction pulse
 */
export default function ChemistryLogo({
  className = "w-9 h-9",
  glow = true,
  interactive = true,
  showBadge = false,
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className} ${
        interactive ? "group cursor-pointer" : ""
      }`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible transition-transform duration-500 group-hover:scale-105"
      >
        <defs>
          {/* Glowing neon chemistry gradients */}
          <linearGradient id="chemFlaskGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stop-color="#00F5FF" />
            <stop offset="50%" stop-color="#00BFFF" />
            <stop offset="100%" stop-color="#8B5CF6" />
          </linearGradient>

          <linearGradient id="chemLiquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00FF9C" stop-opacity="0.9" />
            <stop offset="50%" stop-color="#00F5FF" stop-opacity="0.95" />
            <stop offset="100%" stop-color="#00BFFF" stop-opacity="0.85" />
          </linearGradient>

          <linearGradient id="chemHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00F5FF" stop-opacity="0.8" />
            <stop offset="60%" stop-color="#8B5CF6" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#00FF9C" stop-opacity="0.7" />
          </linearGradient>

          <radialGradient id="chemCoreGlow" cx="50%" cy="65%" r="45%">
            <stop offset="0%" stop-color="#00F5FF" stop-opacity="0.35" />
            <stop offset="50%" stop-color="#00FF9C" stop-opacity="0.2" />
            <stop offset="100%" stop-color="#00F5FF" stop-opacity="0" />
          </radialGradient>

          {/* Liquid clip path within the Erlenmeyer body */}
          <clipPath id="flaskFluidClip">
            <path d="M 45 42 L 31 73 C 28.5 78.5 32.5 84 38.5 84 L 61.5 84 C 67.5 84 71.5 78.5 69 73 L 55 42 Z" />
          </clipPath>

          {/* SVG Glow Filter */}
          <filter id="chemNeonFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Core Luminescence */}
        {glow && (
          <circle
            cx="50"
            cy="58"
            r="32"
            fill="url(#chemCoreGlow)"
            className="transition-opacity duration-500 group-hover:opacity-100 opacity-70"
          />
        )}

        {/* Outer Hexagonal Benzene Ring / Carbon Skeleton */}
        <polygon
          points="50,6 88,28 88,72 50,94 12,72 12,28"
          fill="rgba(11, 18, 36, 0.55)"
          stroke="url(#chemHexGrad)"
          strokeWidth="2.2"
          strokeLinejoin="round"
          className="transition-colors duration-500 group-hover:stroke-[var(--cyan)]"
        />

        {/* Hexagon Inner Delocalized Bond Ring (Aromatic Ring) */}
        <polygon
          points="50,13 81,31 81,69 50,87 19,69 19,31"
          fill="none"
          stroke="rgba(0, 245, 255, 0.2)"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          strokeLinejoin="round"
        />

        {/* Rotating Atomic Orbital Track 1 */}
        <g className="transition-transform duration-1000 ease-out group-hover:rotate-180 origin-center">
          <ellipse
            cx="50"
            cy="50"
            rx="41"
            ry="16"
            transform="rotate(-28 50 50)"
            fill="none"
            stroke="rgba(139, 92, 246, 0.45)"
            strokeWidth="1.2"
            strokeDasharray="4 2.5"
          />
          {/* Valence Electron 1 */}
          <circle
            cx="85"
            cy="32"
            r="3.2"
            fill="#00F5FF"
            filter={glow ? "url(#chemNeonFilter)" : undefined}
            className="animate-pulse"
          />
          <circle cx="85" cy="32" r="1.4" fill="#FFFFFF" />
          {/* Valence Electron 2 */}
          <circle
            cx="15"
            cy="68"
            r="2.8"
            fill="#8B5CF6"
            filter={glow ? "url(#chemNeonFilter)" : undefined}
          />
          <circle cx="15" cy="68" r="1.2" fill="#FFFFFF" />
        </g>

        {/* Rotating Atomic Orbital Track 2 */}
        <g className="transition-transform duration-1000 ease-out group-hover:-rotate-180 origin-center">
          <ellipse
            cx="50"
            cy="50"
            rx="41"
            ry="16"
            transform="rotate(32 50 50)"
            fill="none"
            stroke="rgba(0, 245, 255, 0.45)"
            strokeWidth="1.2"
            strokeDasharray="4 2.5"
          />
          {/* Valence Electron 3 */}
          <circle
            cx="84"
            cy="69"
            r="3.2"
            fill="#00FF9C"
            filter={glow ? "url(#chemNeonFilter)" : undefined}
            className="animate-pulse"
          />
          <circle cx="84" cy="69" r="1.4" fill="#FFFFFF" />
          {/* Valence Electron 4 */}
          <circle
            cx="16"
            cy="31"
            r="2.8"
            fill="#00BFFF"
            filter={glow ? "url(#chemNeonFilter)" : undefined}
          />
          <circle cx="16" cy="31" r="1.2" fill="#FFFFFF" />
        </g>

        {/* Liquid Reaction inside Flask (Clipped) */}
        <g clipPath="url(#flaskFluidClip)">
          {/* Liquid Base */}
          <rect x="20" y="55" width="60" height="35" fill="url(#chemLiquidGrad)" />
          {/* Meniscus / Fluid Wave */}
          <path
            d="M 28 58 Q 40 54 50 58 T 72 58 L 72 88 L 28 88 Z"
            fill="url(#chemLiquidGrad)"
            opacity="0.95"
          />
          {/* Fluid Surface Wave Glow Line */}
          <path
            d="M 30 58 Q 40 54 50 58 T 70 58"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Bubbles in Solution */}
          <circle cx="43" cy="74" r="2.2" fill="#FFFFFF" opacity="0.75" />
          <circle cx="56" cy="69" r="2.8" fill="#FFFFFF" opacity="0.8" />
          <circle cx="50" cy="78" r="1.8" fill="#FFFFFF" opacity="0.6" />
          <circle cx="38" cy="64" r="1.5" fill="#FFFFFF" opacity="0.7" />
          <circle cx="61" cy="76" r="2.0" fill="#FFFFFF" opacity="0.65" />
        </g>

        {/* Erlenmeyer Glass Flask Outline */}
        <path
          d="M 45 23 
             L 45 38 
             L 30.5 72 
             C 27.8 78 31.8 84.5 38.5 84.5 
             L 61.5 84.5 
             C 68.2 84.5 72.2 78 69.5 72 
             L 55 38 
             L 55 23"
          fill="none"
          stroke="url(#chemFlaskGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={glow ? "url(#chemNeonFilter)" : undefined}
          className="transition-colors duration-500 group-hover:stroke-[var(--cyan)]"
        />

        {/* Flask Rim / Lip */}
        <rect
          x="42"
          y="20"
          width="16"
          height="4"
          rx="2"
          fill="#00F5FF"
          filter={glow ? "url(#chemNeonFilter)" : undefined}
        />

        {/* Volumetric Graduation Lines (Measurement Ticks) */}
        <line x1="48" y1="52" x2="53" y2="52" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
        <line x1="45" y1="62" x2="52" y2="62" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
        <line x1="42" y1="72" x2="51" y2="72" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />

        {/* Flask Glass Reflection Glare */}
        <path
          d="M 53 26 L 53 36 L 65 65"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Effervescent Rising Vapor Bubbles Leaving Flask Neck */}
        <circle cx="50" cy="14" r="2.2" fill="#00FF9C" filter={glow ? "url(#chemNeonFilter)" : undefined} />
        <circle cx="48" cy="8" r="1.6" fill="#00F5FF" opacity="0.9" />
        <circle cx="53" cy="4" r="1.2" fill="#8B5CF6" opacity="0.8" />

        {/* Tiny Chemical Energy Sparkles */}
        <path
          d="M 72 20 Q 72 23 75 23 Q 72 23 72 26 Q 72 23 69 23 Q 72 23 72 20 Z"
          fill="#00F5FF"
          opacity="0.85"
        />
        <path
          d="M 28 36 Q 28 38.5 30.5 38.5 Q 28 38.5 28 41 Q 28 38.5 25.5 38.5 Q 28 38.5 28 36 Z"
          fill="#00FF9C"
          opacity="0.75"
        />
      </svg>

      {/* Optional Status indicator badge */}
      {showBadge && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--green)] ring-2 ring-[#050816] shadow-[0_0_8px_var(--green)] animate-pulse" />
      )}
    </div>
  );
}
