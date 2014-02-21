var gulp       = require('gulp');
var gutil      = require('gulp-util');
var browserify = require('gulp-browserify');
var eslint     = require('gulp-eslint');
var rename     = require('gulp-rename');
var uglify     = require('gulp-uglify');

var scripts = ['geopattern2.js', 'lib/*.js'];

gulp.task('lint', function () {
	gulp.src(scripts)
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task('browserify', function () {
	gulp.src('geopattern2.js')
		.pipe(browserify())
		.pipe(uglify())
		.pipe(rename('geopattern.min.js'))
		.pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
	gulp.watch(scripts, ['browserify']);
});

gulp.task('default', ['browserify', 'watch']);
