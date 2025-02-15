/**
 * TODO: Enable commented recommended rules.
 */
module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    //'plugin:cypress/recommended',
    'plugin:import/recommended',
    //'plugin:jsx-a11y/recommended',
    //'plugin:promise/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    //'plugin:react-redux/recommended',
    'prettier',
  ],
  globals: {
    log: true,
    expect: true,
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
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-app/react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'type',
        ],
        pathGroups: [
          {
            pattern: 'app/**',
            group: 'internal',
          },
          {
            pattern: '@webkom/lego-bricks',
            group: 'external',
          },
        ],
        pathGroupsExcludedImportTypes: ['type'],
        alphabetize: {
          order: 'asc',
        },
      },
    ],
  },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
    },
  ],
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
  },
};
