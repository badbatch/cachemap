const config = require('@repodog/webpack-config/test.cjs');

module.exports = {
  ...config({ compiler: 'babel-loader' }),
};
