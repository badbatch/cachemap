const customLaunchers = require('./custom-launchers.json');
const webpackConfig = require('./webpack.config.labs');

module.exports = (config) => {
  config.set({
    autoWatch: true,
    basePath: '',
    browserNoActivityTimeout: 120000,
    browsers: Object.keys(customLaunchers),
    client: {
      captureConsole: true,
      mocha: { timeout: 0 },
    },
    colors: true,
    concurrency: 5,
    customLaunchers,
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'test/specs/index.ts',
    ],
    logLevel: config.LOG_INFO,
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    port: 9876,
    preprocessors: {
      'test/specs/index.ts': ['webpack', 'sourcemap'],
    },
    reporters: ['progress', 'saucelabs'],
    sauceLabs: {
      startConnect: false,
      testName: 'Cachemap browser unit tests',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
    },
    singleRun: true,
    webpack: webpackConfig,
  });
};
