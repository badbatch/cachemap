const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/index.ts',
  },
  output: {
    filename: '[name].js',
    library: 'Cachemap',
    libraryTarget: 'umd',
  },
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
              modules: false,
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
    }, {
      test: /.worker\.js$/,
      use: {
        loader: 'worker-loader',
      },
    }],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      WEB_ENV: true,
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new LodashModuleReplacementPlugin(),
  ],
  devtool: 'source-map',
};
