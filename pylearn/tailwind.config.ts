import type { Config } from "tailwindcss";

// Design tokens ported directly from Phase 4 (High-Fidelity UI Design Direction).
// Keep this file as the single source of truth for color/type decisions —
// components should never hardcode hex values, only these token names.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "ink-indigo": "#2A2762",
        "signal-blue": "#3B6FE0",
        "spine-teal": "#12897A",
        "xp-amber": "#E8A23D", // reserved for gamification (XP, streaks, badges) only
        "flag-coral": "#D6572E", // errors, "common mistakes" callouts, destructive actions
        paper: "#F7F6F2",
        "paper-dark": "#17162B",
      },
      fontFamily: {
        // Latin display/UI face
        sans: ["Plus Jakarta Sans", "sans-serif"],
        // Arabic display/UI face — same type family lineage as the mono face below,
        // so a language switch never feels like a design-system switch.
        "sans-ar": ["IBM Plex Sans Arabic", "sans-serif"],
        // Code face — always LTR, always this face, in both locales.
        mono: ["IBM Plex Mono", "monospace"],
      },
      fontSize: {
        display: ["32px", { lineHeight: "40px", fontWeight: "500" }],
        h2: ["22px", { lineHeight: "28px", fontWeight: "500" }],
        h3: ["17px", { lineHeight: "24px", fontWeight: "500" }],
        body: ["15px", { lineHeight: "24px", fontWeight: "400" }],
        caption: ["13px", { lineHeight: "18px", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};

export default config;
