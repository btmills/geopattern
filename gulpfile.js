'use strict';

var gulp        = require('gulp');
var browserify  = require('gulp-browserify');
var concat      = require('gulp-concat');
var plumber     = require('gulp-plumber');
var to5         = require('gulp-6to5');
var uglify      = require('gulp-uglify');
var packagejson = require('./package.json');

var paths = {
	src: ['src/**/*.js'],
	lib: 'lib',
	main: packagejson.main
};

gulp.task('build', function () {
	gulp.src(paths.src)
		.pipe(to5())
		.pipe(gulp.dest(paths.lib));
});

gulp.task('browserify', function () {
	gulp.src(paths.main)
		.pipe(plumber())
		.pipe(browserify({
			standalone: 'GeoPattern',
			ignore: 'buffer'
		}))
		.pipe(uglify())
		.pipe(concat('geopattern.min.js'))
		.pipe(gulp.dest('./js'));
});

gulp.task('watch', function () {
	gulp.watch(paths.src, ['build', 'browserify']);
});

gulp.task('default', ['build', 'watch']);
