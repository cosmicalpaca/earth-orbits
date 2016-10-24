const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');

/** Webpack **/

const production = process.argv.includes('-p');

let webpackConfig = require('./webpack.config');
let compiler = webpack(webpackConfig);

function compileJs() {
    return new Promise(resolve => {
        compiler.run((err, stats) => {
            if (err) throw new gutil.PluginError('webpack', err);
            gutil.log(stats.toString({
                chunks: false,
                colors: true,
            }));
            resolve();
        });
    });
}

/** Tasks **/

gulp.task('serve', () => {
    if (production) return;

    browserSync.init({
        server: {
            baseDir: './public',
        },
        open: false,
    });

    gulp.watch('./public/index.html', browserSync.reload);
    gulp.watch('./src/app/**/*.js', () => { compileJs(); });
    gulp.watch('./src/styles/**.scss', ['sass']);
});

gulp.task('webpack', (callback) => {
    compileJs().then(callback);
});

gulp.task('sass', () => {
    return gulp.src('./src/styles/*scss')
        .pipe(gulpif(!production, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(!production, sourcemaps.write()))
        .pipe(gulp.dest('./public/build'))
        .pipe(browserSync.stream());
});

gulp.task('default', ['webpack', 'sass', 'serve']);
