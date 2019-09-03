module.exports = {
  plugins: {
    'postcss-cssnext': {},
    'postcss-px-to-viewport': {
      viewportWidth: 1080,
      viewportHeight: 2316,
      unitPrecision: 5,
      viewportUnit: 'vw',
      selectorBlackList: ['.ignore', '.hairlines', 'mint'],
      minPixelValue: 1,
      mediaQuery: false
    },
    cssnano: {
      preset: 'advanced',
      autoprefixer: false,
      'postcss-zindex': false
    }
  }
}
