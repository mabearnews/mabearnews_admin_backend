var gulp = require('gulp'),
    pkg = require('./package.json'),
    jshint = require('gulp-jshint'),
    nodemon = require('gulp-nodemon');

var scriptFiles = './app/*.js';

gulp.task('lint', function(){
    gulp.src(scriptFiles)
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

gulp.task('lint-watch', function(){
    gulp.run('lint');
    gulp.watch(scriptFiles, function(){
	gulp.run('lint');
    });
});

gulp.task('start', function () {
  nodemon({
    script: 'app/index.js'
  , ext: 'js'
  , env: { 'NODE_ENV': 'development' }
  });
})

gulp.task('develop', function() {
    nodemon({
	script: 'app/index.js',
	ext: 'js',
	task: ['lint']
    }).on('restart', function() {
	console.log("Restarted");
    });
});

gulp.task('default', function() {
    gulp.run('develop');
});
