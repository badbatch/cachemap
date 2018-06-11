const webpack = require('webpack');
const { resolve } = require('path');
const webpackConfig = require('./webpack.config.base');

webpackConfig.plugins.push(
  new webpack.LoaderOptionsPlugin({
    debug: true,
  }),
  new webpack.SourceMapDevToolPlugin({
    test: /\.(tsx?|jsx?)$/,
  }),
);

module.exports = {
  mode: 'development',
  module: {
    rules: [{
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
    }, {
      enforce: 'pre',
      test: /\.(tsx?|jsx?)$/,
      use: {
        loader: 'source-map-loader',
      },
    }, {
      enforce: 'post',
      exclude: /node_modules|\.test|^.+\.test.tsx?$/,
      include: resolve(__dirname, 'src'),
      test: /\.tsx?$/,
      use: [{
        loader: 'istanbul-instrumenter-loader',
        options: { esModules: true },
      }],
    }],
  },
  ...webpackConfig,
};
