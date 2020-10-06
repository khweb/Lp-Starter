var gulp      = require('gulp'),
importAllFile = require('less-plugin-glob'),
less		  = require('gulp-less'),
gutil         = require('gulp-util' ),
browserSync   = require('browser-sync'),
concat        = require('gulp-concat'),
uglify        = require('gulp-uglify'),
rename        = require('gulp-rename'),
del           = require('del'),
cleancss      = require('gulp-clean-css'),
rename        = require('gulp-rename'),
autoprefixer  = require('gulp-autoprefixer'),
include       = require('gulp-html-tag-include'),
htmlmin       = require('gulp-htmlmin'),
sourcemaps	  = require('gulp-sourcemaps');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		open: false,
	})
});

gulp.task('html', function() {
	return gulp.src(['app/html/*.html'])
		.pipe(include())
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('app'));
});

gulp.task('less', function() {
	return gulp.src( 'app/less/main.less')
	.pipe(sourcemaps.init())
	.pipe(less({plugins: [ importAllFile ]}))
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['cover 99.5%']))
	.pipe(cleancss())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest( 'app/css/' ))
	.pipe(browserSync.stream())
});

gulp.task('js', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/owl-carousel/owl.carousel.min.js',
		'app/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Mifify js (opt.)
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('watch', ['html', 'less', 'js', 'browser-sync'], function() {
	gulp.watch('app/html/**/*.html', ['html']);
	gulp.watch('app/less/**/*.less', ['less']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/*.html', browserSync.reload)
});

gulp.task('build', ['removedist', 'less', 'js', 'html'], function() {

    var buildFiles = gulp.src([
        'app/*.html',
    ]).pipe(gulp.dest('dist'));

    var buildCss = gulp.src([
        'app/css/main.min.css',
    ]).pipe(gulp.dest('dist/css'));

    var buildJs = gulp.src([
        'app/js/scripts.min.js',
    ]).pipe(gulp.dest('dist/js'));

    var buildFonts = gulp.src([
        'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));
		
		var buildImage = gulp.src([
			'app/img/**/*',
	]).pipe(gulp.dest('dist/img'));

});

gulp.task('removedist', function() { return del.sync('dist'); });

gulp.task('default', ['watch']);
