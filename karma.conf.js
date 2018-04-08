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
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'test/specs/index.ts',
      'src/worker.ts',
    ],
    logLevel: config.LOG_INFO,
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    port: 9876,
    preprocessors: {
      'test/specs/index.ts': ['webpack', 'sourcemap'],
      'src/worker.ts': ['webpack', 'sourcemap'],
    },
    proxies: {
      '/worker-cachemap.worker.js': '/base/src/worker.ts',
    },
    webpack: webpackConfig,
  });
};
