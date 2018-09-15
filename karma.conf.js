const webpackConfig = require('./webpack.config.test');

const WORKER_PATH = 'packages/core-worker/src/worker/index.ts';
const files = [`tests/integration/${process.env.TEST_ENV}/**/*.test.*`];
const preprocessors = { [`tests/integration/${process.env.TEST_ENV}/**/*.test.*`]: ['webpack', 'sourcemap'] };
const proxies = {};

if (process.env.TEST_ENV === 'worker') {
  files.push(WORKER_PATH);
  preprocessors[WORKER_PATH] = ['webpack', 'sourcemap'];
  proxies['/cachemap.worker.js'] = `/base/${WORKER_PATH}`;
}

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
    files,
    frameworks: ['mocha', 'chai', 'sinon'],
    logLevel: config.LOG_INFO,
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    port: 9876,
    preprocessors,
    proxies,
    webpack: webpackConfig,
  });
};
