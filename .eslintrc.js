module.exports = {
  rules: {
    'react/prefer-stateless-function': 0,
    'react/function-component-definition': 0,
    'react/jsx-props-no-spreading': 0,
    'import/prefer-default-export': 0,
    'react/forbid-prop-types': 0,
    'react/destructuring-assignment': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'no-return-assign': 0,
    'prefer-const': 0,
    'react/jsx-no-target-blank': 0,
    'no-debugger': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 0,
    'no-unused-vars': 0,
    'react/no-unescaped-entities': 0,
    'jsx-a11y/anchor-is-valid': ['error', {
      components: ['Link'],
      specialLink: ['to'],
    }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
  globals: {
    document: 'writable',
    window: 'writable',
  },
  env: {
    jest: 1,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  extends: ['airbnb', 'plugin:react/recommended'],
  plugins: ['react-hooks'],
};
