const { heroui } = require("@heroui/theme/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // make sure it's pointing to the ROOT node_module
    "../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#0a0a0a",
            background2: "#17181c", // 新增
            background3: "#18181b", // 新增
            foreground: "#fff",
            primary: {
              DEFAULT: "#6563e0",
              foreground: "#fff",
            },
          },
        },
        light: {
          colors: {
            background: "#fff",
            background2: "#f0f6ff", // 新增
            background3: "#f9fafb", // 新增
            foreground: "#23272f",
            primary: {
              DEFAULT: "#6563e0",
              foreground: "#fff",
            },
          },
        },
      },
    }),
  ],
};
