import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
      },
      colors: {
        "science-blue": "#0063bf", // Wikimedia blue
        "sea-green": "#339966", // Wikimedia green
        "red-berry": "#990000", // Wikimedia red
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
        "pop-in": "popIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
          },
        popIn: {
          "0%": { transform: "scale(0.95)", opacity: 0.5 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
    },
  },
  plugins: [typography],
};
