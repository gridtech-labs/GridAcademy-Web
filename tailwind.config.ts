import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'var(--font-deva)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#1760f4",
          dark: "#0e4dd4",
          tint: "#e8f0fe",
        },
        // Exam Hall palette
        ink: { DEFAULT: "#0e1726", soft: "#1b2638", muted: "#aeb7c7" },
        paper: "#f5f7fa",
        line: "#e4e7ec",
        saffron: "#f5a524",
      },
    },
  },
  plugins: [],
};
export default config;
