"use strict";

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var pug = require('gulp-pug');

gulp.task('styles', function() {
    gulp.src('./app/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./app/dist/css'))
});

var scriptArray = [
    './app/key-codes/key-codes.js',
    './app/calculator/calculator.module.js',
    './app/calculator/calculator.component.js',
    './app/exchange-rates/exchange-rates.module.js',
    './app/exchange-rates/exchange-rates.component.js',
    './app/filters/round.js',
    './app/filters/reverse.js',
    './app/app.module.js'
];

gulp.task('scripts', function() {
    return gulp.src(scriptArray)
        .pipe(concat('main.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('./app/dist/js'))
});

var viewsArray = [
    './app/*.pug',
    './app/calculator/*.pug',
    './app/exchange-rates/*.pug'
];

gulp.task('views', function buildHTML() {
    return gulp.src(viewsArray)
    .pipe(pug({
        // Your options in here.
    }))
    .pipe(gulp.dest(function(file) {
        return file.base;
    }));
});

gulp.task('watch',function() {
    gulp.watch(['./app/sass/*.scss', scriptArray, viewsArray], ['styles', 'scripts', 'views']);
});

gulp.task('default', ['styles', 'scripts', 'views']);
