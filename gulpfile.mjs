import gulp from 'gulp';
const { src, dest, watch, parallel, series } = gulp;

import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
const sass = gulpSass(dartSass);

import concat from 'gulp-concat';
import uglifyEs from 'gulp-uglify-es';
const uglify = uglifyEs.default;
import bs from 'browser-sync';
const browserSync = bs.create();
import autoprefixer from 'gulp-autoprefixer';
import clean from 'gulp-clean';
import avif from 'gulp-avif';
import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';
import svgSprite from 'gulp-svg-sprite';
import include from 'gulp-include';

function pages() {
	return src('app/pages/*.html')
		.pipe(include({
			includePaths: 'app/components'
		}))
		.pipe(dest('app'))
		.pipe(browserSync.stream())
}

function fonts() {
	return src('app/fonts/src/*.*')
		.pipe(fonter({
			formats: ['woff', 'ttf']
		}))
		.pipe(src('app/fonts/*.ttf'))
		.pipe(ttf2woff2())
		.pipe(dest('app/fonts'))
}

function images() {
	return src(['app/images/src/*.*', '!app/images/src/*.svg'])
		.pipe(newer('app/images'))
		.pipe(avif({ quality: 50 }))

		.pipe(src('app/images/src/*.*'))
		.pipe(newer('app/images'))
		.pipe(webp())

		.pipe(src('app/images/src/*.*'))
		.pipe(newer('app/images'))
		.pipe(imagemin())

		.pipe(dest('app/images'))
}

function sprite() {
	return src('app/images/*.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: '../sprite.svg',
					example: true
				}
			}
		}))
		.pipe(dest('app/images'))
}

function scripts() {
	return src([
		'app/js/main.js',
	])
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(dest('app/js'))
		.pipe(browserSync.stream())
}

function styles() {
	return src('app/scss/style.scss')
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'] }))
		.pipe(concat('style.css'))
		.pipe(sass().on('error', sass.logError))
		.pipe(dest('app/css'))
		.pipe(concat('style.min.css'))
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream());
}

function watching() {
	browserSync.init({
		server: {
			baseDir: "app/"
		}
	});
	watch(['app/scss/style.scss', 'app/scss/media.scss'], styles)
	watch(['app/images/src'], images)
	watch(['app/js/main.js'], scripts)
	watch(['app/components/*', 'app/pages/*'], pages)
	watch(['app/*.html']).on('change', browserSync.reload);
}

function cleanDist() {
	return src('dist', { allowEmpty: true })
		.pipe(clean())
}

function building() {
	return src([
		'app/css/style.min.css',
		'!app/images/**/*.html',
		'app/images/*.*',
		// '!app/images/*.svg',
		// 'app/images/sprite.svg',
		'app/fonts/*.*',
		'app/js/main.min.js',
		'app/**/*.html'
	], { base: 'app', encoding: false })
		.pipe(dest('dist'))
}

export { styles, images, fonts, pages, building, sprite, scripts, watching };

export const build = series(cleanDist, building);
export default parallel(styles, images, scripts, pages, watching);
