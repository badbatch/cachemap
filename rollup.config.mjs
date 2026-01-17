import rollupConfig from '@repodog/rollup-config';
import swcConfig from '@repodog/swc-config';
import swcPlugin from '@rollup/plugin-swc';

// Rollup requires config be default export
// eslint-disable-next-line import-x/no-default-export
export default {
  ...rollupConfig({ compiler: swcPlugin({ swc: swcConfig.ts }) }),
};
