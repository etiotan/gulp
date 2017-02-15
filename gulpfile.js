/* ///////////////////////////////////////
Variables
*/ ///////////////////////////////////////
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    mkdirp = require('mkdirp'),
    touch = require('touch'),
    runSequence = require('run-sequence'),
    imagemin = require('gulp-imagemin');

/* ///////////////////////////////////////
Image Minifier
*/ ///////////////////////////////////////
gulp.task('imagemin', function() {
    return gulp.src('app/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('app/images/*'))
});
/* ///////////////////////////////////////
Sass/Pug/Uglify
*/ ///////////////////////////////////////
gulp.task('sass', function() {
    return gulp.src('app/sass/styles.sass')
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest('app/css'));
});

gulp.task('pug', function() {
    return gulp.src('app/index.pug')
        .pipe(plumber())
        .pipe(pug())
        .pipe(gulp.dest('app'));
});

gulp.task('uglify', function() {
    gulp.src('app/js/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('app/minjs'));
});
/* ///////////////////////////////////////
BrowserSync for Sass & Pug
*/ ///////////////////////////////////////
gulp.task('sass:watch', ['sass'], browserSync.reload);
gulp.task('pug:watch', ['pug'], browserSync.reload);
gulp.task('script:watch', ['uglify'], browserSync.reload);
gulp.task('watch', function() {
    browserSync({
        server: {
            baseDir: 'app/'
        }
    });
    gulp.watch('app/**/*.pug', ['pug:watch']);
    gulp.watch('app/**/*.sass', ['sass:watch']);
    gulp.watch('app/js/*.js', ['script:watch']);
});

/////////////////////////////////////////////
// Copy directory for final build
////////////////////////////////////////////
gulp.task('build:copy', function() {
    return gulp.src('app/**/*/')
        .pipe(gulp.dest('build/'));
});
/////////////////////////////////////////////
// Deletes Files for Final Build
////////////////////////////////////////////
gulp.task('build:clean', ['build:copy'], function() {
    del([
        'build/sass/',
        'build/js',
        'build/pug'
    ]);

});
/////////////////////////////////////////////
// Final Build
////////////////////////////////////////////
gulp.task('build-final', function(callback) {
        runSequence('build:copy', 'build:clean', callback);
    })
    /////////////////////////////////////////////
    // Create Folders for New Project
    ////////////////////////////////////////////
gulp.task('create-folders', function() {
    mkdirp('app/sass');
    mkdirp('app/pug');
    mkdirp('app/js');
});
/////////////////////////////////////////////
// Create Files for New Project
////////////////////////////////////////////
gulp.task('create-files', ['create-folders'], function() {
    touch('app/sass/styles.sass');
    touch('app/index.pug');
    touch('app/js/scripts.js');

});
/////////////////////////////////////////////
// New Project
////////////////////////////////////////////
gulp.task('create-project', function(callback) {
    runSequence('create-folders', 'create-files', callback);
});
