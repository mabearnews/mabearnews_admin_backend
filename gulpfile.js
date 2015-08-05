var gulp = require('gulp'),
    pkg = require('./package.json'),
    jshint = require('gulp-jshint'),
    nodemon = require('gulp-nodemon');

var scriptFiles = '*.js';

gulp.task('lint', function(){
    gulp.src(scriptFiles)
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

gulp.task('lint-watch', function(){
    gulp.watch(scriptFiles, ['lint']);
});

gulp.task('start', function () {
  nodemon({
      script: 'index.js',
      ext: 'js',
      env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('develop', ['lint', 'start', 'lint-watch']);

gulp.task('default', ['develop']);
