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
    'plugin:import/errors',
    'plugin:import/warnings',
    //'plugin:jsx-a11y/recommended',
    //'plugin:promise/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    //'plugin:react-redux/recommended',
    'react-app',
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
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    babelOptions: {
      configFile: './.babelrc',
    },
  },
  plugins: [
    'cypress',
    'import',
    'simple-import-sort',
    'jsx-a11y',
    'promise',
    'react',
    'react-hooks',
    'react-redux',
  ],
  ignorePatterns: ['mazemap/mazemap.min.*', '**/vendor/*.js'],
  rules: {
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-app/react/react-in-jsx-scope': 'off',
    'jest/valid-describe': 'off', // valid-describe was replaced by valid-describe-callback, but still needs its rule ...
    'jest/valid-describe-callback': 'error',
  },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            /**
             * Each `import` is matched against all regexes on the `from` string. The import ends up
             * in the group with the longest match. In case of a tie, the first matching group wins.
             * Read more here: https://github.com/lydell/eslint-plugin-simple-import-sort#custom-grouping
             */
            groups: [
              // Node.js builtins.
              [
                '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
              ],
              // Packages.`react` related packages come first.
              ['^react', '^@?\\w'],
              [
                // Internal packages.
                '^(app|config|mazemap|schema|server)(/.*|$)',
                // Side effect imports.
                '^\\u0000',
                // Parent imports. Put `..` last.
                '^\\.\\.(?!/?$)',
                '^\\.\\./?$',
                // Other relative imports. Put same-folder imports and `.` last.
                '^\\./(?=.*/)(?!/?$)',
                '^\\.(?!/?$)',
                '^\\./?$',
              ],
              // Style imports.
              ['^.+\\.s?css$'],
            ],
          },
        ],
      },
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
      flowVersion: '0.131.0',
    },
    jest: {
      version: require('jest/package.json').version,
    },
  },
};
