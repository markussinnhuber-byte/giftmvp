import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: { '2xl': '1rem' },
      boxShadow: { soft: '0 6px 24px rgba(0,0,0,0.08)' }
    },
  },
  plugins: [],
} satisfies Config;