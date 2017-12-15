const webpackConfig = require('./webpack.config');

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'test/**/*',
    ],
    preprocessors: {
      'test/**/*': ['webpack', 'sourcemap'],
    },
    webpack: webpackConfig,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    concurrency: Infinity,
    client: { captureConsole: true },
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
  });
};
