// tailwind.config.js
module.exports = {
  darkMode: 'class', // <--- IMPORTANT: This line enables the toggle logic
  content: [
    // ... your content paths (e.g., "./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}")
  ],
  theme: {
    extend: {
      animation: {
        "meteor-effect": "meteor 5s linear infinite",
        "blob": "blob 7s infinite", // <-- Added blob animation here
      },
      keyframes: {
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "rotate(215deg) translateX(-500px)", opacity: "0" },
        },
        blob: { // <-- Added blob keyframes here
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};