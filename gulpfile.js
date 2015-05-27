/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gulp = require('gulp'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');


var lessFiles = ['web/less/dashboard.less'];
gulp.task('less',function(){
    gulp.src(lessFiles)
            .pipe(less())
            .pipe(gulp.dest('web/css'));
});

var appFiles = ['web/js/controllers/*.js',
                'web/js/services/*.js',
                'web/js/directives/*.js',
                 'web/js/*.js'];
gulp.task('lint',function(){
return gulp.src(appFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

var compressJSFiles =['web/lib/C3/c3.js',
    'web/lib/D3/d3.js','web/lib/jqcloud/*.js',
    'web/lib/jvectormap/*.js','web/lib/morris/*.js',
    'web/lib/Scrollanimations/*.js','web/lib/*.js'];

gulp.task('minifyLibsJS',function(){
return gulp.src(compressJSFiles)
    .pipe(concat('all.js'))
    .pipe(gulp.dest('web/libMin'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('web/libMin'));
});

var compressCSSFiles =['web/lib/C3/c3.css',
    'web/lib/D3/d3.css','web/lib/jqcloud/*.css',
    'web/lib/jvectormap/*.css','web/lib/morris/*.css',
    'web/lib/Scrollanimations/*.css','web/lib/*.css'];

gulp.task('minifyLibsCSS',function(){
    return gulp.src(compressCSSFiles)
        .pipe(concat('allLib.css'))
        .pipe(gulp.dest('web/libMin'));
});

var filesToCopy = [ 'web/config/**','web/css/**',
    'web/imgs/**','web/js/**', 'web/js/*.js','web/libMin/**','web/views/**',
    'web/index.html','web/login.html','web/loginAgain.html',
    'web/offline.html','olympicsDashApp.cache',
    'package.json','server.js'];

gulp.task('build-copy',function(){
gulp.src(filesToCopy,{base:'./web'})
    .pipe(gulp.dest('build/web'));
});

gulp.task('watchfiles', function() {
    gulp.watch(filesToCopy, ['build-copy']).on('change', printEvent);
    gulp.watch('web/less/**', ['less']).on('change', printEvent);
});

function printEvent(event) {
    console.log('File : ' + event.path + ' has been ' + event.type + ', running tasks..');
}


gulp.task('delete-build', function(cb) {
    return del(['build/*'], cb);
});

gulp.task('clean',['delete-build']);
gulp.task('default',['less','lint','minifyLibsJS','minifyLibsCSS','watchfiles']);