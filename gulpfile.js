let gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	browserSync = require('browser-sync'),
	autoprefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	twig = require("gulp-twig"),
	changed = require('gulp-changed');

gulp.task('sass', function () {
	return gulp.src('./src/sass/**/*.sass')
		.pipe(changed("./dist/css"))
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed',
			debugInfo: true
		}))
		.pipe(autoprefixer({
			overrideBrowsersList: [
				"> 5%"
			],
			cascade: false,
			grid: true
		}))
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.reload({stream: true}));
});
gulp.task('image', function () {
	return gulp.src('./src/images/**/*.*')
		.pipe(changed("./dist/images"))
		.pipe(imagemin([
			imagemin.jpegtran({
				arithmetic: true,
				buffer: true
			}),
			imagemin.optipng({
				optimizationLevel: 7,
				paletteReduction: false,
				colorTypeReduction: false,
				bitDepthReduction: false,
				buffer: true
			}),
			imagemin.svgo({
				buffer: true
			}),
		]))
		.pipe(gulp.dest('./dist/images'))
		.pipe(browserSync.reload({stream: true}));
});
gulp.task('browser-sync', function () {
	browserSync.init({
		server: "./",
		startPath: "./dist/archive.html", // After it browser running
		host: 'localhost',
		port: 8000,
		notify: false
	});
});
gulp.task('twig', function () {
	return gulp.src('./src/*.twig')
		.pipe(changed("./dist"))
		.pipe(twig())
		.pipe(gulp.dest('./dist'))
		.pipe(browserSync.reload({stream: true}));
});
gulp.task('sass:watch', function () {
	gulp.watch("./src/sass/**/*.sass", gulp.series("sass"));
});
gulp.task('twig:watch', function () {
	gulp.watch("./src/**/*.twig", gulp.series("twig"));
});
gulp.task('image:watch', function () {
	gulp.watch("./src/images/**/*.*", gulp.series("image"));
});

gulp.task('default', gulp.parallel("sass", "twig", 'image', "sass:watch", "twig:watch", "image:watch", 'browser-sync'));
