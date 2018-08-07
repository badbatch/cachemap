const gulp = require('gulp');
const typedoc = require('gulp-typedoc');

const sources = ['**/*.ts', '!**/*.test.*', '!**/__test__/**'];

gulp.task('document', () => gulp.src(sources)
  .pipe(typedoc({
    exclude: '**/+(helpers|module-definitions|proxies|reaper)/**',
    excludeExternals: true,
    excludeNotExported: true,
    excludePrivate: true,
    excludeProtected: true,
    ignoreCompilerErrors: true,
    includeDeclarations: true,
    mode: 'file',
    module: 'esnext',
    name: 'Cachemap',
    out: './docs',
    readme: 'none',
    target: 'es6',
    theme: 'default',
    verbose: true,
    version: true,
  })));
