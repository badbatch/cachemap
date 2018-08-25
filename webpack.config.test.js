const webpack = require('webpack');
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
      test: /\.tsx?$/,
      use: {
        loader: 'babel-loader',
      },
    }, {
      enforce: 'pre',
      test: /\.(tsx?|jsx?)$/,
      use: {
        loader: 'source-map-loader',
      },
    }],
  },
  ...webpackConfig,
};
