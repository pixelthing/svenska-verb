const fs            = require('fs');
const del           = require('del');
const path          = require('path');
const runSequence   = require('run-sequence');
const browserSync   = require('browser-sync');
const reload        = browserSync.reload;
const gulp          = require('gulp');
const jshint        = require('gulp-jshint');
const sass          = require('gulp-sass');
const mustache      = require('gulp-mustache');
const sourcemaps    = require('gulp-sourcemaps');
const plumber       = require('gulp-plumber');
const uglify        = require('gulp-uglify');
const gutil         = require('gulp-util');
const cssmin        = require('gulp-cssmin');
const rename        = require('gulp-rename');
const forEach       = require('gulp-foreach');
const postcss       = require('gulp-postcss');
const concat        = require('gulp-concat');
const ghPages       = require('gulp-gh-pages');

// store our default options here.
var options = {
  production: false,
  devServer: {
    port: 8000,
    ui: 8000,
    weinre: 9092
  },
  autoprefixer: {
    browsers: ['last 4 versions']
  }
};

function errorHandler(err) {
  console.log(err.toString());
  this.emit('end');
}

/**
 * Task: default
 * builds the website, launches a dev-server and start watching for changes.
 */
gulp.task('default', function() {
  runSequence('build', 'serve');
  gulp.watch(['src/views/**/*.mustache', 'src/views/**/*.json'], ['templates', reload]);
  gulp.watch(['src/**/*.scss'], ['styles', reload]);
  gulp.watch(['src/**/*.js'], ['jshint']); // note: we use watchify for the js
});

/**
 * Task: build
 * cleans dist folder then builds the website to the dist folder
 */
gulp.task('build', function(done) {
  runSequence(['clean'], ['copy', 'templates', 'scriptsBlocking', 'scriptsNon', 'styles'], done);
});

/**
 * Task: deploy
 * cleans dist folder then builds the website to the dist folder
 */
gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

/**
 * Task: copy
 * 
 */
gulp.task('copy', function() {
  
  gulp
    .src([ 
      'src/views/data/*.json', 
      'src/js/root/*.js',
      'src/views/views/pages/manifest.json',
    ]).pipe(gulp.dest('dist/'));
  gulp
    .src([ 
      'node_modules/sw-toolbox/*.js'
    ])
    .pipe(gulp.dest('dist/js/'));
  gulp
    .src([ 
      'src/img/*'
    ])
    .pipe(gulp.dest('dist/img/'));
    
});

/**
 * Task: serve
 * starts a development server that has the capability to reload on changes
 */
gulp.task('serve', function() {
  browserSync({
    port: options.devServer.port,
    open: false,
    server: ['./dist'],
    ui: {
      port: options.devServer.ui,
      weinre: { port: options.devServer.weinre }
    },
    notify: false,
    logLevel: 'silent'
  });
});

/**
 * Task: templates
 * builds the templates to the dist folder
 */
gulp.task('templates', function() {
  
  gulp.src("./src/views/pages/*.mustache")
    .pipe(mustache({}))
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest("./dist"));
    
});

/**
 * Task: scriptsBlocking
 * handles processing of our scritps.
 */
gulp.task('scriptsBlocking', ['jshint'], function() {
  return gulp.src('src/js/blocking/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('blocking.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'));
});

/**
 * Task: scriptsNon
 * handles processing of our scritps.
 */
gulp.task('scriptsNon', ['jshint'], function() {
  return gulp.src([
      'node_modules/fastclick/lib/fastclick.js',
      //'node_modules/hammerjs/hammer.js',
      'node_modules/es6-promise/dist/es6-promise.js',
      'src/js/nonblocking/*.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('nonblocking.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'));
});

/**
 * Task: jshint
 * runs jshint on our javascript files
 */
gulp.task('jshint', function() {
  gulp
    .src('src/js/**/*.js')
    .pipe(plumber({ errorHandler }))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Task: styles
 * builds the styles using sass and autoprefixer
 */
gulp.task('styles', function() {
  gulp
    .src('src/scss/main.scss')
    .pipe(plumber({ errorHandler }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([require('autoprefixer')]))
    .pipe(cssmin())
    .pipe(rename('main.css'))
    .pipe(sourcemaps.write('./', { sourceRoot: '/src' }))
    .pipe(gulp.dest('./dist/css'));
});

/**
 * Task: clean
 * removes the dist folder
 */
gulp.task('clean', del.bind(null, ['dist'], { dot: true }));
