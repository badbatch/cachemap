const webpack = require('webpack');

module.exports = {
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          babelrc: false,
          plugins: ['lodash'],
          presets: [
            ['@babel/preset-env', {
              debug: true,
              targets: { browsers: 'last 4 versions' },
              useBuiltIns: 'usage',
            }],
            '@babel/preset-stage-0',
          ],
        },
      }, {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      }],
    }],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      WEB_ENV: true,
    }),
  ],
  devtool: 'cheap-module-eval-source-map',
};
