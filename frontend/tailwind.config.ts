import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#fcf9f8",
        surface: "#ffffff",
        "surface-container": "#f6f3f2",
        "surface-container-high": "#f0edec",
        primary: "#6d4e9f",
        "primary-container": "#c9a7ff",
        "on-primary": "#ffffff",
        "on-primary-container": "#563786",
        beige: "#eee1cd",
        "soft-pink": "#ffd8e7",
        success: "#3f7d4f",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        ink: "#1c1b1b",
        muted: "#4a4550",
        border: "#ccc3d2",
      },
      fontFamily: {
        heading: ["Sora", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        btn: "12px",
        card: "16px",
        "card-lg": "24px",
        product: "20px",
      },
      boxShadow: {
        soft: "0px 10px 30px rgba(0,0,0,0.04)",
        floating: "0px 15px 35px rgba(201,167,255,0.2)",
      },
      maxWidth: {
        app: "1200px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
