const webpack = require('./webpack.config');

const WORKER_PATH = 'tests/integration/worker/worker';
const files = [`tests/integration/${process.env.TEST_ENV}/**/*.test.*`];
const preprocessors = { [`tests/integration/${process.env.TEST_ENV}/**/*.test.*`]: ['webpack', 'sourcemap'] };
const proxies = {};

if (process.env.TEST_ENV === 'worker') {
  files.push(`${WORKER_PATH}.ts`);
  preprocessors[`${WORKER_PATH}.ts`] = ['webpack', 'sourcemap'];
  proxies['/worker.js'] = `/base/${WORKER_PATH}.js`;
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
    webpack,
  });
};
