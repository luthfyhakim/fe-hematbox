/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#10B981", // Warna hijau utama (Emerald 500)
        "primary-light": "#D1FAE5", // (Emerald 100)
      },
    },
  },
  plugins: [],
};
