"use strict";
let gulp = require('gulp');
let sass = require('gulp-sass');
let concat = require('gulp-concat');
let webpack = require('webpack-stream');


gulp.task('sass', function(){
    
    return gulp.src('src/styles/**/*.{scss,sass}')
        .pipe(sass())
        .pipe(concat('snake-race.css'))
        .pipe(gulp.dest(''));
    
});


gulp.task('webpack', function(){
    
    return gulp.src('src/scripts/view.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest(''));
        
});


gulp.task('watch', function(){
    
    gulp.watch('src/scripts/**/*', ['webpack']);
    gulp.watch('src/styles/**/*', ['sass']);
    
});


gulp.task('build', ['sass', 'webpack']);

gulp.task('default', ['build', 'watch']);