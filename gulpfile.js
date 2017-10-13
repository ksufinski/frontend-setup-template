var gulp = require('gulp'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  cssmin = require('gulp-minify-css'),
  browserSync = require("browser-sync"),
  rimraf = require('rimraf'),
  concat = require('gulp-concat'),
  //depLinker = require('dep-linker'),
  jshint = require('gulp-jshint'),
  reload = browserSync.reload,
  babel = require('gulp-babel'),
  inject = require('gulp-inject');


var path = {
  build: {
    html: 'build/',
    js: 'build/',
    css: 'build/',
    img: 'build/img'
  },
  src: {
    html: 'src/**/*.html',
    js: 'src/*.js',
    css: 'src/main.scss',
    img: 'src/img/**/*.*'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/**/*.js',
    css: 'src/**/*.scss',
    img: 'src/img/**/*.*'
  },
  clean: './build'
};

var config = {
  server: {
    baseDir: './build'
  },
  tunnel: false,
  host: 'localhost',
  port: 9000,
  browser: 'default'
};

gulp.task('img:build', function () {
  gulp.src(path.src.img)
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}))
});

gulp.task('html:build', function () {
  gulp.src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}))
});

gulp.task('js:build', function () {
  gulp.src(path.src.js)
    .pipe(babel({
      presets: ['es2015', 'stage-3']
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}))
});

gulp.task('css:build', function () {
  gulp.src(path.src.css)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(prefixer())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}))
});

gulp.task('build', [
  'html:build',
  'js:build',
  'css:build',
  'img:build',
  'inject'
]);

gulp.task('server', function () {
  browserSync(config);
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('watch', function () {
  watch([path.watch.html], function (event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.css], function (event, cb) {
    gulp.start('css:build');
  });
  watch([path.watch.js], function (event, cb) {
    gulp.start('js:build');
  });
  watch([path.watch.img], function (event, cb) {
    gulp.start('img:build');
  });
});

gulp.task('lint', function () {
  return gulp.src(path.src.js)
    .pipe(jshint());
});

gulp.task('inject', () => {
  const target = gulp.src(`${path.build.html}index.html`);
  const sources = gulp.src([`./build/*.js`, `./build/*.css`]);
  return target.pipe(inject(sources, {relative: true}))
    .pipe(gulp.dest(path.build.html));
});

gulp.task('default', ['build', 'server', 'watch', 'inject']);