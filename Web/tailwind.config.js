/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pekon: {
          bg: "#0F1416",
          surface: "#151C1E",
          card: "#1C2026",
          border: "#3B4A41",
          primary: "#00F2A9",
          mint: "#C1FFDD",
          text: "#DFE2EB",
          muted: "#B9CBBF",
          subtle: "#84958A",
        },
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
      },
    },
  },
  plugins: [],
};
