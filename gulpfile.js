let gulp = require('gulp');
const	sass = require('gulp-sass')(require('sass')),
  rename = require('gulp-rename'),
  browserSync = require('browser-sync'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  del = require('del'),
  cssmin = require('gulp-cssmin');

/* Чистим папочки build */
gulp.task('clean', async function () {
  del.sync('build')
});

/* компрессия, минимизация, что бы работало на всех 8 версиях, складываем в папку css */
gulp.task('sass', function () {
	return gulp.src('app/scss/**/*/scss')
	.pipe(sass({outputStyle: 'compressed'}))
	.pipe(rename({suffix: '.min'	}))
	.pipe(autoprefixer({
		overrideBrowserlist: ('last 8 versions')
	}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream:true}))
});

/* ноормализация, слик для слайдера, попап для всяких окон */
gulp.task('style', function () {
  return gulp.src([
    'node_modules/normalize.css/normalize.css',
    'node_modules/slick-carousel/slick/slick.css',
    'node_modules/magnific-popup/dist/magnific-popup.css',
    'node_modules/jquery-form-styler/dist/jquery.formstyler.css',
    'node_modules/jquery-form-styler/dist/jquery.formstyler.theme.css',
  ])
    .pipe(concat('libs.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('app/css'))
});
/* конкатинация, уменьшение и складываем в папку js */
gulp.task('script', function (){
	return gulp.src(['node_modules/slick-carousel/slick/slick.js', 
	'node_modules/magnidic-popup/dist/jquery.magnific-popup.js',

	'node_modules/jquery-form-styler/dist/jquery.formstyler.js',])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
});

gulp.task('html', function () {
  return gulp.src('app/*.html')
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('js', function () {
  return gulp.src('app/js/*.js')
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
});

gulp.task('export', async function () {
  let buildHtml = gulp.src('app/**/*.html')
    .pipe(gulp.dest('build'));

  let BuildCss = gulp.src('app/css/**/*.css')
    .pipe(gulp.dest('build/css'));

  let BuildJs = gulp.src('app/js/**/*.js')
    .pipe(gulp.dest('build/js'));

  let BuildFonts = gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));

  let BuildImg = gulp.src('app/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

gulp.task('watch', function () {
  gulp.watch('app/scss/**/*.scss', gulp.parallel('sass'))
  gulp.watch('app/*.html', gulp.parallel('html'))
  gulp.watch('app/js/*.js', gulp.parallel('js'))
});

gulp.task('build', gulp.series('clean', 'export'));

gulp.task('default', gulp.parallel('style', 'script', 'sass', 'watch', 'browser-sync'))