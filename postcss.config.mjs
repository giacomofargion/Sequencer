export default {
  // Tailwind v4 moved its PostCSS plugin into a separate package.
  // Using @tailwindcss/postcss keeps us aligned with the new API.
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
