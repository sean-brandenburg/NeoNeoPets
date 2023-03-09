const daisyui = require("daisyui");
const typography = require("@tailwindcss/typography");

const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {}
  },

  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/colors/themes')['[data-theme=light]'],
          'body': {
            'background-color': '#407CD6',
            'border-color': '#407CD6',
            'overflow': 'hidden',
          },
        },
      },
    ],
  },

  plugins: [typography, daisyui]
};

module.exports = config;