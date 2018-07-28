const { resolve } = require('path');
const webpackConfig = require('./webpack.config.test');

module.exports = (config) => {
  config.set({
    autoWatch: true,
    basePath: '',
    client: {
      captureConsole: true,
      mocha: { timeout: 0 },
    },
    colors: true,
    concurrency: Infinity,
    coverageIstanbulReporter: {
      dir: resolve(__dirname, 'coverage', 'web'),
      fixWebpackSourcePaths: true,
      reports: ['json', 'lcov', 'text-summary'],
    },
    files: [
      'integration-tests/**/*.test.*',
      'packages/obrero/worker.ts',
    ],
    frameworks: ['mocha', 'chai', 'sinon'],
    logLevel: config.LOG_INFO,
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    port: 9876,
    preprocessors: {
      'integration-tests/**/*.test.*': ['webpack', 'sourcemap'],
      'packages/obrero/worker.ts': ['webpack', 'sourcemap'],
    },
    proxies: {
      '/cachemap.worker.js': '/base/packages/obrero/worker.ts',
    },
    webpack: webpackConfig,
  });
};
