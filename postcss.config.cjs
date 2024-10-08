module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {},
    'postcss-preset-env': {
      features: { 'nesting-rules': false }
    }
  }
}
