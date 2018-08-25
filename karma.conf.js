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
    files: [
      'tests/integration/web/**/*.test.*',
    ],
    frameworks: ['mocha', 'chai', 'sinon'],
    logLevel: config.LOG_INFO,
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    port: 9876,
    preprocessors: {
      'tests/integration/web/**/*.test.*': ['webpack', 'sourcemap'],
    },
    webpack: webpackConfig,
  });
};
