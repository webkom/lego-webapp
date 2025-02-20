// @ts-nocheck

import eslint from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import eslintPluginImportX from 'eslint-plugin-import-x';
import tsParser from '@typescript-eslint/parser';

export default tseslint.config(
  {
    ignores: [
      'dist/*',
      // Temporary compiled files
      '**/*.ts.build-*.mjs',

      // JS files at the root of the project
      '*.js',
      '*.cjs',
      '*.mjs',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    ...reactHooks.configs.recommended,
    plugins: { 'react-hooks': reactHooks },
  },
  {
    languageOptions: {
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        1,
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-namespace': 0,
      '@typescript-eslint/no-unused-expressions': [
        1,
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      'import-x/order': [
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
  },
  // Disable rules of hooks for +data.ts because useConfig is allowed
  {
    files: ['**/+data.ts'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    // Previously disabled rules
    files: ['app/**/*'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'react/prop-types': 'off',
    },
  },
);
