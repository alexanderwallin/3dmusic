
var gulp       = require('gulp'),
    browserify = require('gulp-browserify'),
    livereload = require('gulp-livereload');

gulp.task('start', ['build', 'watch']);

gulp.task('build', ['build:js', 'build:html']);

gulp.task('build:js', function() {
  return gulp.src('./src/js/app.js')
    .pipe(browserify())
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(livereload());
});

gulp.task('build:html', function() {
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dist/'))
    .pipe(livereload());
})

gulp.task('watch', ['livereload', 'watch:js', 'watch:html']);

gulp.task('livereload', function() {
  livereload.listen();
})

gulp.task('watch:js', function() {
  gulp.watch('.src/js/**/*.js', ['build:js']);
});

gulp.task('watch:html', function() {
  gulp.watch('.src/**/*.html', ['build:html']);
});