/**
 * TODO: Enable commented recommended rules.
 */
module.exports = {
  env: {
    browser: true,
    es2022: true,
    jest: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    //'plugin:cypress/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    //'plugin:jsx-a11y/recommended',
    //'plugin:promise/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    //'plugin:react-redux/recommended',
    'react-app/jest',
    'prettier',
  ],
  globals: {
    log: true,
    expect: true,
    jest: true,
    __DEV__: true,
    __CLIENT__: true,
    cypress: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    babelOptions: {
      configFile: './babel.config.js',
    },
  },
  plugins: [
    'cypress',
    'import',
    'jsx-a11y',
    'promise',
    'react',
    '@typescript-eslint',
    'react-hooks',
    'react-redux',
  ],
  ignorePatterns: ['mazemap/mazemap.min.*', '**/vendor/*.js'],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-app/react/react-in-jsx-scope': 'off',
    'jest/valid-describe': 'off', // valid-describe was replaced by valid-describe-callback, but still needs its rule ...
    'jest/valid-describe-callback': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      webpack: {
        config: './config/webpack.client.js',
      },
    },
    react: {
      version: 'detect',
    },
    jest: {
      version: require('jest/package.json').version,
    },
  },
};
