const gulp = require('gulp');
const print = require('gulp-print');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const cssnano = require('gulp-cssnano');
const browserify = require('browserify');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');
const del = require('del');

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: 'build'
    }
  });
});

gulp.task('clean', () => del.sync('build'));

gulp.task('js', () => {
  const b = browserify({
    entries: './app/js/main.js',
    debug: true
  });

  return b
    .transform('babelify', { presets: ['es2015'] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('build', ['js', 'clean'], () => gulp.src(['app/**/*.html', 'app/**/*.css'])
  .pipe(print())
  .pipe(gulpIf('*.css', cssnano()))
  .pipe(gulpIf('*.html', htmlmin({ collapseWhitespace: true })))
  .pipe(gulp.dest('build')));

gulp.task('serve', ['browserSync'], () => {
  gulp.watch('app/**/*.*', ['build', browserSync.reload]);
});
