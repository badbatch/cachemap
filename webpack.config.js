const { resolve } = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpackConfig = require('./webpack.config.base');

webpackConfig.module.rules.unshift({
  include: [
    resolve(__dirname, 'src'),
  ],
  test: /\.tsx?$/,
  use: [{
    loader: 'awesome-typescript-loader',
    options: {
      babelCore: '@babel/core',
      transpileOnly: true,
      useBabel: true,
    },
  }],
});

webpackConfig.plugins.push(
  new webpack.SourceMapDevToolPlugin({
    filename: '[name].js.map',
    test: /\.(tsx?|jsx?)$/,
  }),
  new UglifyJsPlugin({
    sourceMap: true,
  }),
  new BundleAnalyzerPlugin({
    analyzerMode: 'disabled',
    generateStatsFile: true,
    statsFilename: './bundle/stats.json',
  }),
);

module.exports = {
  entry: {
    cachemap: './src/index.ts',
    'default-cachemap': './src/default-cachemap/index.ts',
    'worker-cachemap': './src/worker-cachemap/index.ts',
    'worker-cachemap.worker': './src/worker.ts',
  },
  output: {
    filename: '[name].js',
    library: 'Cachemap',
    libraryTarget: 'umd',
  },
  ...webpackConfig,
};
