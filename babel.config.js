module.exports = (api) => {
  const env = api.env();
  const modules = env === 'main' ? 'commonjs' : false;
  let targets;

  if (env === 'browser') {
    targets = { browsers: 'last 2 versions' };
  } else if (env === 'debug') {
    targets = { browsers: 'chrome >= 60' };
  } else {
    targets = { node: '8' };
  }

  return {
    comments: false,
    ignore: [
      '**/*.d.ts',
      '**/*.test.*',
      '**/__test__/**',
      '**/lib/**',
      '**/node_modules/**',
    ],
    plugins: [
      'lodash',
    ],
    presets: [
      ['@babel/preset-env', {
        modules,
        targets,
        useBuiltIns: 'usage',
      }],
      '@babel/preset-stage-0',
      '@babel/preset-typescript',
    ],
  };
};
