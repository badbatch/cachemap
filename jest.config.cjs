const jestConfig = require('@repodog/jest-config');
const swcConfig = require('@repodog/swc-config');

const { DEBUG } = process.env;
const isDebug = DEBUG === 'true';
const config = jestConfig({ compilerOptions: swcConfig });

module.exports = {
  ...config,
  collectCoverage: false,
  collectCoverageFrom: [],
  ...(isDebug ? {} : { testMatch: ['<rootDir>/packages/**/*.test.ts', '<rootDir>/tests/node/index.test.ts'] }),
};
