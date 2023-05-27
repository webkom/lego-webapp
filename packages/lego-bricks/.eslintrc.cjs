module.exports = {
  extends: [
    '../../.eslintrc.js',
    'plugin:jsx-a11y/recommended',
    'plugin:promise/recommended',
  ],
  settings: {
    'import/resolver': {
      webpack: false,
    }
  }
}