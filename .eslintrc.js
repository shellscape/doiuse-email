module.exports = {
  extends: ['shellscape/typescript', 'plugin:import/typescript'],
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        vars: 'local',
        varsIgnorePattern: '^_'
      }
    ]
  }
};
