'use strict';

const composer = require('gulp-uglify/composer');
const cssnano = require('gulp-cssnano');
const del = require('del');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const options = require('gulp-options');
const path = require('path');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const uglifyjs = require('uglify-es');
const webserver = require('gulp-webserver');
const yaml = require('yamljs');

const minify = composer(uglifyjs, console);

sass.compiler = require('node-sass');

let pug_data_file = path.join("src", "data", 'data.yml');


function clean() {
  return del('dist');
}

function sass_task() {
  return gulp.src('src/**/*.scss')
    .pipe(sass({
      outputStyle: options.has('dev') ? 'expanded' : 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest('dist'));
}

function css_task() {
  return gulp.src('src/**/*.css')
    .pipe(gulpif(!options.has('dev'), cssnano()))
    .pipe(gulp.dest('dist'));
}

function js_min_task() {
  return gulp.src(['src/**/*.js', '!src/**/*.min.js'])
    .pipe(gulpif(!options.has('dev'), minify({})))
    .pipe(gulp.dest('dist'));
}

function js_task() {
  return gulp.src('src/**/*.min.js')
    .pipe(gulp.dest('dist'));
}

function pug_task() {
  let pug_locals = yaml.load(pug_data_file);
  return gulp.src(['src/**/*.pug', '!src/includes/*.pug'])
    .pipe(pug({
      locals: pug_locals
    }))
    .pipe(gulp.dest('dist'));
}

function alphabet_images_task() {
  return gulp.src('src/images/**/*')
    .pipe(gulpif(!options.has('dev'), imagemin()))
    .pipe(gulp.dest('dist/images/'));
}

function files_task() {
  return gulp.src(['src/**', '!src/**/*.pug', '!src/**/*.scss', '!src/**/*.js', '!src/**/*.css', '!src/images/**/*'])
    .pipe(gulp.dest('dist'));
}

function webserver_task() {
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
}

// exports.open = series(clean, parallel(sass, css, js, pug, files));
exports.default = gulp.series(clean, gulp.parallel(alphabet_images_task, css_task, sass_task, js_task, js_min_task, pug_task, files_task));

function watch_all() {
  gulp.watch('src/**/*.min.js', js_task)
  gulp.watch('src/**/*.js', js_min_task);
  gulp.watch('src/**/*.scss', sass_task);
  gulp.watch('src/**/*.css', css_task);
  gulp.watch(['src/**/*.pug', pug_data_file], pug_task);
  gulp.watch('src/images/alphabet_game/*', alphabet_images_task);
  gulp.watch(['src/**', '!src/images/**/*', '!src/**/*.pug', '!src/**/*.scss', '!src/**/*.js', `!${pug_data_file}`], files_task);
};
exports.watch = watch_all;

exports.dev = gulp.series(exports.default, gulp.parallel(watch_all, webserver_task));