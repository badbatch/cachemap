const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const typedoc = require('gulp-typedoc');
const ts = require('gulp-typescript');
const merge = require('merge-stream');
const { Linter } = require('tslint');

const sources = ['**/*.ts', '!**/*.test.*', '!**/__test__/**'];

gulp.task('main', () => {
  const tsProject = ts.createProject('tsconfig.json', { module: 'commonjs' });
  const packagePath = `${process.env.LERNA_ROOT_PATH}/packages/${process.env.LERNA_PACKAGE_NAME}`;
  process.chdir(packagePath);

  return gulp.src(sources)
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./lib/main'))
    .on('error', () => process.exit(1));
});

gulp.task('types', () => {
  const tsProject = ts.createProject('tsconfig.json', { declaration: true, module: 'commonjs', removeComments: true });
  const transpiled = gulp.src(sources).pipe(tsProject());
  const copied = gulp.src(['src/**/*.d.ts']);

  return merge(transpiled.dts, copied)
    .pipe(gulp.dest('lib/types'))
    .on('error', () => process.exit(1));
});

gulp.task('module', () => {
  const tsProject = ts.createProject('tsconfig.json');

  return gulp.src(sources)
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib/module'))
    .on('error', () => process.exit(1));
});

gulp.task('browser', () => {
  const tsProject = ts.createProject('tsconfig.json');

  return gulp.src(sources)
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib/browser'))
    .on('error', () => process.exit(1));
});

gulp.task('type-check', () => {
  const tsProject = ts.createProject('tsconfig.json', { noEmit: true });

  gulp.src(sources)
    .pipe(tsProject())
    .on('error', () => process.exit(1));
});

gulp.task('tslint', () => {
  gulp.src(sources)
    .pipe(tslint({
      configuration: 'tslint.json',
      fix: true,
      formatter: 'stylish',
      program: Linter.createProgram('tsconfig.json'),
    }))
    .pipe(tslint.report())
    .on('error', () => process.exit(1));
});

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
