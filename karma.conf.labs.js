const webpackConfig = require('./webpack.config.labs');

const customLaunchers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 10',
    version: 'latest',
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 10',
    version: 'latest',
  },
  sl_ie: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: 'latest',
  },
  sl_edge: {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: 'latest',
  },
  sl_safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'MacOS Sierra 10.12',
    version: 'latest',
  },
  sl_ios: {
    base: 'SauceLabs',
    browserName: 'Safari',
    deviceName: 'iPhone Simulator',
    deviceOrientation: 'portrait',
    platformName: 'iOS',
    platformVersion: '11.0',
  },
  sl_android: {
    base: 'SauceLabs',
    browserName: 'Chrome',
    deviceName: 'Android Emulator',
    deviceOrientation: 'portrait',
    platformName: 'Android',
    platformVersion: '6',
  },
};

module.exports = (config) => {
  config.set({
    autoWatch: true,
    basePath: '',
    browserNoActivityTimeout: 45000,
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
    reporters: ['saucelabs'],
    sauceLabs: {
      startConnect: false,
      testName: 'Cachemap browser unit tests',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
    },
    singleRun: false,
    webpack: webpackConfig,
  });
};
