module.exports = {
  content: ["./public/*.{html,js,css} ", "./views/**/*.{html,js,ejs}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))"
      }
    }
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {}
    }
  ]
};
