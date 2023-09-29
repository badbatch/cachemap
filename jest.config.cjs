const config = require('@repodog/jest-config');

const { DEBUG } = process.env;
const isDebug = DEBUG === 'true';

module.exports = {
  ...config,
  collectCoverageFrom: ['packages/**/*.ts', ...config.collectCoverageFrom.slice(1)],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  ...(isDebug ? {} : { testMatch: ['<rootDir>/tests/node/index.test.ts'] }),
};
