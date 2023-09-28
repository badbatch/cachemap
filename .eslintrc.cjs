module.exports = {
  extends: ['@repodog/eslint-config'],
  parserOptions: {
    project: ['./tsconfig.json', './packages/*/tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  root: true,
  rules: {
    // disabled devDependencies due to https://github.com/import-js/eslint-plugin-import/issues/2168
    'import/no-extraneous-dependencies': [
      2,
      {
        devDependencies: true,
        peerDependencies: false,
      },
    ],
    'jest/max-nested-describe': [
      2,
      {
        max: 6,
      },
    ],
  },
};
