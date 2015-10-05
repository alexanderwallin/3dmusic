
var gulp       = require('gulp'),
    rimraf     = require('gulp-rimraf'),
    jade       = require('gulp-jade'),
    browserify = require('gulp-browserify'),
    babelify   = require('babelify'),
    sass       = require('gulp-sass'),
    ffmpeg     = require('gulp-fluent-ffmpeg'),
    sourcemaps = require('gulp-sourcemaps')
    webserver  = require('gulp-webserver'),
    livereload = require('gulp-livereload');

gulp.task('start', ['build', 'watch', 'serve']);

gulp.task('clean', function() {
  return gulp.src('./dist', { read: false })
    .pipe(rimraf());
});

gulp.task('build', ['build:js', 'build:css', 'build:views', 'build:audio']);

gulp.task('build:js', function() {
  return gulp.src('./src/js/app.js')
    .pipe(sourcemaps.init())
    .pipe(browserify({
      debug: true,
      transform: [babelify]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(livereload());
});

gulp.task('build:css', function() {
  return gulp.src('./src/scss/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(livereload());
});

gulp.task('build:views', function() {
  return gulp.src('./src/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./dist/'))
    .pipe(livereload());
});

gulp.task('build:audio', ['audio:convert'], function() {
  return gulp.src(['./src/audio/*.mp3', './src/audio/*.ogg'])
    .pipe(gulp.dest('./dist/assets/audio'))
    .pipe(livereload());
})

gulp.task('audio:convert', function() {
  return gulp.src('./src/audio/*.wav')
    .pipe(ffmpeg('mp3', function(cmd) {
      return cmd
        .audioBitrate('128k')
        .audioChannels(2)
        .audioCodec('libmp3lame')
    }))
    .pipe(gulp.dest('./src/audio'));
})

gulp.task('watch', ['livereload', 'watch:js', 'watch:css', 'watch:views', 'watch:audio']);

gulp.task('livereload', function() {
  livereload.listen();
})

gulp.task('watch:js', function() {
  gulp.watch('./src/js/**/*.js', ['build:js']);
});

gulp.task('watch:css', function() {
  gulp.watch('./src/scss/**/*.scss', ['build:css']);
});

gulp.task('watch:views', function() {
  gulp.watch('./src/**/*.jade', ['build:views']);
});

gulp.task('watch:audio', function() {
  gulp.watch('./src/audio/*.wav', ['build:audio']);
});

gulp.task('watch:audio:convert', function() {
  gulp.watch('./src/audio/*.mp3', ['build:audio'])
})

gulp.task('serve', function() {
  return gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});
