import del from 'del';
import mkdirp from 'mkdirp';
import gulp from 'gulp';
import ghPages from 'gulp-gh-pages';
import excludeGitignore from 'gulp-exclude-gitignore';
import eslint from 'gulp-eslint';

// config
const paths = {
  build: './build',
  dist: './dist',
  static: './static',
  calculator: './node_modules/mobius-final-fantasy-fusion-calculator'
};

// tasks
gulp.task('dist:clean', () => {
  const log = [
    del([`${paths.dist}/*`])
  ];

  return Promise.all(log).then(response => response);
});

gulp.task('dist:setup', ['dist:clean'], () => {
  const log = [
    mkdirp(paths.dist)
  ];

  return Promise.all(log).then(response => response);
});

gulp.task('dist:calculator', ['dist:setup'], () => gulp.src([
  `${paths.calculator}/**/*`,
  `!${paths.calculator}/LICENSE`,
  `!${paths.calculator}/package.json`
])
  .pipe(gulp.dest(paths.dist)));

gulp.task('dist:static', ['dist:setup'], () => gulp.src(`${paths.static}/**/*`)
  .pipe(gulp.dest(paths.dist)));

gulp.task('dist', ['dist:static', 'dist:calculator'], () => gulp.src(`${paths.dist}/**/*`)
  .pipe(ghPages()));

gulp.task('lint', () => gulp.src([
  '**/*.js',
  '!node_modules/**'
])
  .pipe(excludeGitignore())
  .pipe(eslint({
    fix: true
  }))
  .pipe(eslint.format('node_modules/eslint-formatter-pretty'))
  .pipe(eslint.failAfterError())
  .pipe(gulp.dest('.'))
);

gulp.task('default', ['lint']);
