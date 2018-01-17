const webpackConfig = require('./webpack.config.labs');

const customLaunchers = {
  sl_chrome: {
    browserName: 'chrome',
    platform: 'Windows 10',
    version: 'latest-2',
  },
  sl_firefox: {
    browserName: 'firefox',
    platform: 'Windows 10',
    version: 'latest-2',
  },
  sl_ie: {
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: 'latest-4',
  },
  sl_edge: {
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: 'latest-2',
  },
  sl_safari: {
    browserName: 'safari',
    platform: 'MacOS Sierra 10.12',
    version: 'latest-2',
  },
  sl_ios: {
    browserName: 'Safari',
    deviceName: 'iPhone Simulator',
    deviceOrientation: 'portrait',
    platformName: 'iOS',
    platformVersion: '11.0',
  },
  sl_android: {
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
    concurrency: Infinity,
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
      testName: 'Cachemap',
      startConnect: true,
    },
    singleRun: true,
    webpack: webpackConfig,
  });
};
