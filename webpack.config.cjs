const glob = require('glob');
const path = require('node:path');
const webpack = require('webpack');

module.exports = {
  entry: glob.sync('./tests/browser/*.test.ts').map(path => `./${path}`),
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        enforce: 'pre',
        test: /\.(tsx?|jsx?)$/,
        use: {
          loader: 'source-map-loader',
        },
      },
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'tests/browser/dist'),
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      moduleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[loaders]',
      test: /\.(tsx?|jsx?)$/,
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
    mainFields: ['browser', 'module', 'main'],
    symlinks: false,
  },
};
