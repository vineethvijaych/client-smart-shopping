/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
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
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      scale: {
        98: "0.98", // Add custom scale-98
      },
      animation: {
        scan: "scan 2s infinite",
        "bounce-slow": "bounce 2s infinite",
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        scan: {
          "0%": { boxShadow: "0 0 0 0 rgba(74, 222, 128, 0.4)" },
          "70%": { boxShadow: "0 0 0 15px rgba(74, 222, 128, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(74, 222, 128, 0)" },
        },
      },
    },
  },
  plugins: [],
};
