const jestConfig = require('@repodog/jest-config');
const swcConfig = require('@repodog/swc-config');

const { DEBUG } = process.env;
const isDebug = DEBUG === 'true';
const config = jestConfig({ compilerOptions: swcConfig });

config.moduleNameMapper['^@cachemap/(.*)$'] = '<rootDir>/packages/$1/src';

module.exports = {
  ...config,
  collectCoverageFrom: ['packages/**/*.ts', ...config.collectCoverageFrom.slice(1)],
  ...(isDebug ? {} : { testMatch: ['<rootDir>/packages/**/*.test.ts', '<rootDir>/tests/node/index.test.ts'] }),
};
