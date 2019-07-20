'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify-es').default;

const javascriptObfuscator = require('gulp-javascript-obfuscator');


// Gulp task to minify Javascript files
gulp.task('scripts', function () {
    return gulp.src('./src/public/js/**/*.js')
        // Minify the files
        .pipe(uglify().on('error', function (e) {
            console.log(e)
        }))
        .pipe(javascriptObfuscator())
        // Output
        .pipe(gulp.dest('./src/public/dist/js'))
});