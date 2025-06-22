import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // 👈 enables dark mode via a CSS class
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
