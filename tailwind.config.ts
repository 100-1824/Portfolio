import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0F172A",
        accent: "#38BDF8",
        secondary: "#10B981",
        surface: "rgba(255,255,255,0.05)",
        // Extended design-system palette (ui-ux-pro-max)
        primary: {
          DEFAULT: "#a855f7",
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#4c1d95",
          950: "#3b0764",
        },
        rose: {
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
        },
      },
      fontFamily: {
        heading: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
        body: ["var(--font-outfit)", "Outfit", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "gradient-x": "gradient-x 8s ease infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        "orb-drift": "orb-drift 20s ease-in-out infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(168,85,247,0.4)" },
          "50%": { boxShadow: "0 0 20px 8px rgba(168,85,247,0.15)" },
        },
        "orb-drift": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "33%": { transform: "translate(30px, -20px)" },
          "66%": { transform: "translate(-20px, 25px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
