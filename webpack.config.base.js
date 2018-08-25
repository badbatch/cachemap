const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  plugins: [
    new LodashModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
};
