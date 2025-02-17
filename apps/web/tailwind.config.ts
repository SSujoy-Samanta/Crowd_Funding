import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'eth-dark': 'linear-gradient(135deg,#0a0f1a, #1a2a42, #4c3c7b, #6a56a5)',
        'eth-dark-light': 'linear-gradient(135deg, #161b29, #232d49, #4c3c7b, #6a56a5)',
          
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      sm2: "427px",
      xxs: "320px",
    },
  },
  plugins: [],
};
export default config;
