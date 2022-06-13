const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#17829F",
        secondary: "#E7E1DA",
        "accent-1": "#3CA6A9",
        "accent-2": "#2D7E84",
        highlight: "#E3AD58",
      },
			fontFamily: {
				'sans': ['Josefin Sans', ...defaultTheme.fontFamily.sans],
				'comic-cat': ['Comic Cat', ...defaultTheme.fontFamily.sans],
			},
			fontSize: {
				header: '2.5rem',
			}
    },
  },
  plugins: [],
};
