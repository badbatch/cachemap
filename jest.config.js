module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*',
    '!**/__test__/**',
    '!**/*.test.*',
    '!**/*.d.*',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'json',
    'lcov',
    'text-summary',
  ],
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.test.json',
      useBabelrc: true,
    },
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  testMatch: [
    '**/src/**/*.test.*',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
