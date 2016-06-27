var gulp = require('gulp');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');

gulp.task('reload', function () {
	livereload.reload();
});

gulp.task('scripts', function() {
  return gulp.src(['./browser/js/*.js', '/browser/**/*.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('default', function () {
	gulp.start('scripts');
	gulp.watch(['./browser/js/*.js', './index.html'], ['scripts'], ['reload']);

	livereload.listen();
});

