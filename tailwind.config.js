/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Adicione outros caminhos conforme necessário
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f77c3e",
        secondary: "#3a86ff",
        // Adicione mais cores conforme necessário
      },
    },
  },
  plugins: [],
};
