const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const DashboardPlugin = require('webpack-dashboard/plugin');

/**
 * # Webpack Build Process for Data Lasso
 *
 * Available arguments:
 *
 * --production
 * Removes JS and CSS source maps from the output; Sets up `NODE_ENV` variable to`production`.
 *
 * --watch
 * Makes webpack watch for changes
 *
 * --minified
 * Passes output through UglifyJs plugin and builds into `datalasso.min.js`. For use
 * without commonjs modules, such as Data Lasso hosted on GitHub pages
 *
 */

const production = (process.argv.indexOf('--production') >= 0);
const minified = (process.argv.indexOf('--minified') >= 0);
const watch = (process.argv.indexOf('--watch') >= 0);

/** What goes in **/
const entry = path.join(__dirname, 'src/index.js');

/** Where things are built **/
const outputDir = path.join(__dirname, 'public/build');
const outputFile = 'app.js';

function getStylesheetLoader() {
    if (production) {
        return 'style-loader!css-loader!postcss-loader!sass-loader';
    } else {
        return 'style-loader?sourceMap!css-loader?sourceMap!postcss-loader!sass-loader?sourceMap';
    }
}

let webpackConfig = {
    entry: entry,
    output: {
        filename: outputFile,
        path: outputDir,
        // publicPath: '/public/',
    },
    watch: watch,
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: getStylesheetLoader(),
            },
            {
                test: /\.glsl$/,
                loader: 'shader',
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {
                    presets: ['latest', 'react'],
                },
            },
        ],
    },
    devtool: production ? '' : 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'public'),
    },
    postcss: [
        autoprefixer({
            browsers: [
                'last 3 versions',
            ],
        }),
    ],
    plugins: [
        new DashboardPlugin(),
    ],
};

if (production) {
    webpackConfig.plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }));
}

if (minified) {
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
    }));
    webpackConfig.output.filename = 'datalasso.min.js';
}

module.exports = webpackConfig;
