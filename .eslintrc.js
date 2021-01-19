/**
 * TODO: Enable commented recommended rules.
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    //'plugin:cypress/recommended',
    'plugin:flowtype/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jest/style',
    //'plugin:jsx-a11y/recommended',
    //'plugin:promise/recommended',
    'plugin:react/recommended',
    'plugin:react-app/recommended',
    'plugin:react-hooks/recommended',
    //'plugin:react-redux/recommended',
    'react-app',
    'react-app/jest',
    'prettier',
    'prettier/flowtype',
    'prettier/react',
  ],
  globals: {
    log: true,
    expect: true,
    jest: true,
    __DEV__: true,
    __CLIENT__: true,
    cypress: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    babelOptions: {
      configFile: './.babelrc',
    },
  },
  plugins: [
    'cypress',
    'flowtype',
    'import',
    'jsx-a11y',
    'promise',
    'react',
    'react-hooks',
    'react-redux',
  ],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-app/react/react-in-jsx-scope': 'off',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './config/webpack.client.js',
      },
    },
    react: {
      version: 'detect',
      flowVersion: '0.131.0',
    },
  },
};
