const colors = require('tailwindcss-open-color');

function replaceKeys(color) {
  if (typeof color === 'string') {
    return color;
  }
  let newColor = {};
  let idx = 0;
  for (const level in color) {
    let mapped = idx === 0 ? '50' : `${idx}00`;
    newColor = { ...newColor, [mapped]: color[level] };
    idx += 1;
  }
  return newColor;
}

function remapColors(colors) {
  let newColors = {};
  for (const name in colors) {
    if (Object.hasOwnProperty.call(colors, name)) {
      newColors = { ...newColors, [name]: replaceKeys(colors[name]) };
    }
  }
  return newColors;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      ...remapColors(colors),
    },
    extend: {
      flexGrow: {
        4: 4,
        3: 3,
        2: 2,
        1: 1,
      },
    },
  },
  plugins: [],
};
