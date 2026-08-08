import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-alt": "var(--bg-alt)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        line: "var(--line)",
        ink: "var(--text)",
        muted: "var(--muted)",
        lime: "var(--lime)",
        "lime-ink": "var(--lime-ink)",
        navy: "var(--navy)",
        "navy-2": "var(--navy-2)",
        cyan: "var(--cyan)",
        violet: "var(--violet)",
        "violet-deep": "var(--violet-deep)",
        green: "var(--green)",
        amber: "var(--amber)",
        red: "var(--red)",
      },
      fontFamily: {
        sora: ["var(--font-sora)", "Sora", "sans-serif"],
        chakra: ["var(--font-sora)", "Sora", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        jetbrains: ["var(--font-inter)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;