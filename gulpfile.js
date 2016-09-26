const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    });

    gulp.watch('./public/index.html', browserSync.reload);
    gulp.watch('./src/app/**/*', () => {
        compileJs().then(browserSync.reload);
    });
    gulp.watch('./src/styles/**.scss', ['sass']);
});

let webpackConfig = require('./webpack.config');
webpackConfig.watch = true;
var compiler = webpack(webpackConfig);

let compileJs = function() {
    return new Promise(resolve => {
        compiler.run((err, stats) => {
            if (err) throw new gutil.PluginError('webpack', err);
            gutil.log(stats.toString({
                colors: true,
            }));
            resolve();
        });
    })
};

gulp.task('webpack', compileJs);

gulp.task('sass', () => {
    return gulp.src('./src/styles/*scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/build'))
        .pipe(browserSync.stream())
});

gulp.task('default', ['webpack', 'sass', 'serve']);
