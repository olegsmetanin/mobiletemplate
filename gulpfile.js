'use strict';

var livereloadport = 35729,
	serverport = 5001, 

	path = require('path'),

	gulp = require('gulp'),
	runSequence = require('run-sequence'),
	shell = require('gulp-shell'),

	path = require('path'),
	fs = require('fs'),

	gulpsass = require('gulp-sass'),
	bourbon = require('node-bourbon').includePaths,

	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),

	express = require('express'),
	server = express(),
	livereload = require('connect-livereload'),

	browserify = require('browserify'),
	browserify_shim = require('browserify-shim'),
	exorcist = require('exorcist'),
	source = require('vinyl-source-stream'),

	jshint = require('gulp-jshint'),

	font = require('gulp-iconfont'),
	through   = require('through'),
	msxtransform = require('msx').transform;

server.use(express.static(path.resolve('./dist/web')));

gulp.task('bower', 
	shell.task([
		'"./node_modules/.bin/bower" install'
	], {ignoreErrors: true})
);

gulp.task('styles', function () {
	return gulp.src(['./src/web/assets/scss/bm.scss'])
		.pipe(gulpsass({
			outputStyle: 'expanded',
			//outputStyle: 'compressed', 
			sourceComments: 'map',
			includePaths: [
				'./src/web//assets/scss/theme',
//				'./src/web/vendor/bootstrap-sass-official/vendor/assets/stylesheets',
				'./src/web/vendor/font-awesome/scss'
			].concat(bourbon),
			errLogToConsole: true
		}))
		.pipe(gulp.dest('./dist/web/assets/css'));
});

gulp.task('html', function() {
	return gulp.src(['./src/web/**/*', '!./src/web/assets/**', '!./src/web/vendor{,/**}'])
		.pipe(gulp.dest('./dist/web'));
});

gulp.task('img', function() {
	return gulp.src(['./src/web/assets/img/*'])
		.pipe(gulp.dest('./dist/web/assets/img'));
});

gulp.task('font', function(){
	return gulp.src(['./src/web/assets/font/*.svg'])
		.pipe(font({
			fontName: 'bmfont',
			appendCodepoints: true, // recommanded option
			descent:  -256,
			fontHeight: 1792,
			fontWidth: 1536
		}))
		.pipe(gulp.dest('./dist/web/assets/fonts'));
});

gulp.task('bootstrap:js', function() {
  
  var files = [
  	'affix.js',
	'alert.js',
	'button.js',
	'carousel.js',
	'collapse.js',
	'dropdown.js',
	'tab.js',
	'transition.js',
	'scrollspy.js',
	'modal.js',
	'tooltip.js',
	'popover.js'
  ];

	var paths = [];
	for (var i=0; i<files.length; i++) {
		paths.push('./src/web/vendor/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/'+files[i]);
	} 

  return gulp.src(paths)
    .pipe(concat('bootstrap.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/web/assets/js'))
});

gulp.task('bootstrap:font', function() {
	return gulp.src(['./src/web/vendor/bootstrap-sass-official/vendor/assets/fonts/bootstrap/**'])
		.pipe(gulp.dest('./dist/web/assets/fonts'));
});

gulp.task('fontawesome:font', function() {
	return gulp.src([ './src/web/vendor/font-awesome/fonts/**'])
		.pipe(gulp.dest('./dist/web/assets/fonts'));
});

gulp.task('jquery:js', function() {
	return gulp.src([ './src/web/vendor/jquery/dist/**'])
		.pipe(gulp.dest('./dist/web/assets/js'));
});

gulp.task('moment:js', function() {
	return gulp.src([ './src/web/vendor/moment/min/**'])
		.pipe(gulp.dest('./dist/web/assets/js'));
});

gulp.task('modernizr:js', function() {
	return gulp.src([ './src/web/vendor/modernizr/modernizr.js'])
		.pipe(gulp.dest('./dist/web/assets/js'));
});

gulp.task('js:lint', function() {
	return gulp.src("./src/web/assets/js/**/*.js")
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter());
});

gulp.task('js:bundle', function() {
	var name = 'bm6.js';
	var bundler = browserify()
		.add('./src/web/assets/js/'+name)
		.transform(function (file) {

			var source  = '';

			return through(function(data) {
				//console.log(file);
				source += data;
			}, function() {
				var result;

				try {
					result = msxtransform(source);
				} catch (error) {
					error.message += ' in "' + file + '"';

					this.emit('error', error);
				}

				this.queue(result);
				this.queue(null);
			});
		});

	return bundler.bundle({debug: true})
		.on('error', function (err) {
			console.log(err.toString());
			this.emit("end");
		})
		.pipe(exorcist('./dist/web/assets/js/'+name+'.map'))
		.pipe(source(name))
		.pipe(gulp.dest('./dist/web/assets/js'));
});

gulp.task('js', function(done) {
	runSequence('js:lint', 'js:bundle', done);
});

gulp.task('serve', function() {
	server.listen(serverport);
});

gulp.task('watch', function () {
	gulp.watch(['./src/web/assets/js/**'], ['js']);
	gulp.watch(['./src/web/**/*', '!./src/assets/**', '!./src/web/vendor{,/**}'], ['html']);
	gulp.watch(['./src/web/assets/scss/**/*.scss'], ['styles']);
	gulp.watch(['./src/web/assets/img/**'], ['img']);
});

gulp.task('build:web', function(done) {
	runSequence('bower', ['styles', 'html', 'img', 'font', 'bootstrap:js', 'bootstrap:font', 'fontawesome:font', 'jquery:js', 'moment:js', 'modernizr:js', 'js'], done);
});

gulp.task('run', function(done) {
	runSequence('build:web', 'serve', 'watch', done);
});

gulp.task('default', ['build:all']);

//
// Mobile
//

gulp.task('install:mobile',
	shell.task([
		'"./node_modules/.bin/cordova" create dist/mobile com.com.app "My App"'
	], {ignoreErrors: true})
);

gulp.task('install:mobile:ios',
	shell.task([
		'"./../../node_modules/.bin/cordova" platform add ios'
	], {cwd: path.join(__dirname, "dist/mobile"), ignoreErrors: true})
);

gulp.task('install:mobile:android',
	shell.task([
		'"./../../node_modules/.bin/cordova" platform add android'
	], {cwd: path.join(__dirname, "dist/mobile"), ignoreErrors: true})
);

gulp.task('install:mobile:plugins',
	shell.task([
		'"./../../node_modules/.bin/cordova" plugin add org.apache.cordova.console',
		'"./../../node_modules/.bin/cordova" plugin add org.apache.cordova.statusbar',
		'"./../../node_modules/.bin/cordova" plugin add org.apache.cordova.inappbrowser',
		'"./../../node_modules/.bin/cordova" plugin add org.apache.cordova.globalization',
		'"./../../node_modules/.bin/cordova" plugin add org.apache.cordova.device',
		'"./../../node_modules/.bin/cordova" plugin add org.apache.cordova.file',
		'"./../../node_modules/.bin/cordova" plugin add org.apache.cordova.file-transfer'
	], {cwd: path.join(__dirname, "dist/mobile"), ignoreErrors: true})
);

gulp.task('copy:mobile:www', function () {
	return gulp.src('./dist/web/**/*.*')
		.pipe(gulp.dest('./dist/mobile/www'));
});

gulp.task('copy:mobile:common', function () {
	return gulp.src('./src/mobile/common/**/*')
		.pipe(gulp.dest('./dist/mobile'));
});

gulp.task('copy:mobile:ios', ['copy:mobile:common'], function () {
	return gulp.src('./src/mobile/ios/**/*')
		.pipe(gulp.dest('./dist/mobile'));
});

gulp.task('copy:mobile:android', ['copy:mobile:common'], function () {
	return gulp.src('./src/mobile/android/**/*')
		.pipe(gulp.dest('./dist/mobile'));
});

gulp.task('copy:mobile:all', ['copy:mobile:ios','copy:mobile:android']);

gulp.task('build:cordova',
	shell.task([
		'"./../../node_modules/.bin/cordova" build'
	], {cwd: path.join(__dirname, "dist/mobile")})
);

gulp.task('build:mobile:ios', function(done) {
	runSequence('install:mobile', 'install:mobile:ios', 'install:mobile:plugins', 'copy:mobile:www', 'copy:mobile:ios', 'build:cordova',  done);
});

gulp.task('build:mobile:android', function(done) {
	runSequence('install:mobile', 'install:mobile:android', 'install:mobile:plugins', 'copy:mobile:www', 'copy:mobile:android', 'build:cordova',  done);
});

gulp.task('build:mobile:all', function(done) {
	runSequence('install:mobile', 'install:mobile:ios', 'install:mobile:android', 'install:mobile:plugins', 'copy:mobile:www', 'copy:mobile:ios', 'copy:mobile:android', 'build:cordova',  done);
});

gulp.task('update:mobile:ios', function(done) {
	runSequence('copy:mobile:www', 'copy:mobile:ios', 'build:cordova',  done);
});

gulp.task('update:mobile:android', function(done) {
	runSequence('copy:mobile:www', 'copy:mobile:android', 'build:cordova',  done);
});

gulp.task('build:all', function(done) {
	runSequence('build:web', 'build:mobile',  done);
});

gulp.task('run:ios',
	shell.task([
		'"./../../node_modules/.bin/cordova" run ios'
	], {cwd: path.join(__dirname, "dist/mobile")})
);

gulp.task('run:android',
	shell.task([
		'"./../../node_modules/.bin/cordova" run android'
	], {cwd: path.join(__dirname, "dist/mobile")})
);