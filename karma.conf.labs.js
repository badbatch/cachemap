let customLaunchers = require('./custom-launchers.json');
const webpackConfig = require('./webpack.config.labs');

let reporters = ['dots'];

const sauceLabs = {
  startConnect: false,
  testName: 'Cachemap browser unit tests',
  tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
};

if (process.env.LOCAL_ENV) {
  require('dotenv').config(); // eslint-disable-line

  customLaunchers = {
    sl_browser: {
      appiumVersion: '1.7.2',
      base: 'SauceLabs',
      browserName: 'Safari',
      deviceName: 'iPhone Simulator',
      deviceOrientation: 'portrait',
      platformName: 'iOS',
      platformVersion: '11.0',
    },
  };

  reporters = ['mocha'];
  sauceLabs.startConnect = true;

  sauceLabs.connectOptions = {
    logfile: '-',
    noSslBumpDomains: 'all',
    sharedTunnel: true,
    verbose: true,
  };
}

module.exports = (config) => {
  config.set({
    autoWatch: true,
    basePath: '',
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 500000,
    browsers: Object.keys(customLaunchers),
    captureTimeout: 200000,
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
    hostname: 'ci.build',
    logLevel: process.env.LOCAL_ENV ? config.LOG_DEBUG : config.LOG_INFO,
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    port: 9876,
    preprocessors: {
      'test/specs/index.ts': ['webpack', 'sourcemap'],
    },
    reporters: [...reporters, 'saucelabs'],
    sauceLabs,
    singleRun: true,
    webpack: webpackConfig,
  });
};
