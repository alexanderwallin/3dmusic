
var gulp       = require('gulp'),
    rimraf     = require('gulp-rimraf'),
    jade       = require('gulp-jade'),
    browserify = require('gulp-browserify'),
    babelify   = require('babelify'),
    webserver  = require('gulp-webserver'),
    livereload = require('gulp-livereload');

gulp.task('start', ['build', 'watch', 'serve']);

gulp.task('clean', function() {
  return gulp.src('./dist', { read: false })
    .pipe(rimraf());
});

gulp.task('build', ['build:js', 'build:views']);

gulp.task('build:js', function() {
  return gulp.src('./src/js/app.js')
    .pipe(browserify({
      transform: [babelify]
    }))
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(livereload());
});

gulp.task('build:views', function() {
  return gulp.src('./src/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./dist/'))
    .pipe(livereload());
})

gulp.task('watch', ['livereload', 'watch:js', 'watch:views']);

gulp.task('livereload', function() {
  livereload.listen();
})

gulp.task('watch:js', function() {
  gulp.watch('./src/js/**/*.js', ['build:js']);
});

gulp.task('watch:views', function() {
  gulp.watch('./src/**/*.jade', ['build:views']);
});

gulp.task('serve', function() {
  return gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});
