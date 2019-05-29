'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');

// Gulp task to minify Javascript files
gulp.task('scripts', function () {
    return gulp.src('./src/public/js/**/*.js')
        // Minify the files
        .pipe(uglify())
        // Output
        .pipe(gulp.dest('./src/public/dist/js'))
});