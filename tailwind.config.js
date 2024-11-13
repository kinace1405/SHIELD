module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-silver': '#C0C0C0',
        'custom-purple': '#7C3AED',
        'custom-green': '#16A34A',
      },
    },
  },
  plugins: [],
}