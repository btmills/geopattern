var gulp       = require('gulp');
var gutil      = require('gulp-util');
var browserify = require('gulp-browserify');
var concat     = require('gulp-concat');
var eslint     = require('gulp-eslint');
var uglify     = require('gulp-uglify');

var scripts = ['geopattern.js', 'lib/*.js'];

gulp.task('lint', function () {
	gulp.src(scripts)
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task('browserify', function () {
	gulp.src('geopattern.js')
		.pipe(browserify({
			standalone: 'GeoPattern'
		}))
		.pipe(uglify())
		.pipe(concat('geopattern.min.js'))
		.pipe(gulp.dest('./js'));
});

gulp.task('watch', function () {
	gulp.watch(scripts, ['browserify']);
});

gulp.task('default', ['browserify', 'watch']);
