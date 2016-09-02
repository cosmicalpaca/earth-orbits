const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
 */

const production = (process.argv.indexOf('--production') >= 0);
const watch = (process.argv.indexOf('--watch') >= 0);

/** What goes in **/
const entry = path.join(__dirname, 'src/index.js');

/** Where things are built **/
const outputDir = path.join(__dirname, 'public');

function getStylesheetLoader() {
    if (production) {
        return 'css-loader!postcss-loader!sass-loader';
    } else {
        return 'css-loader?sourceMap!postcss-loader!sass-loader?sourceMap';
    }
}

let webpackConfig = {
    entry: entry,
    output: {
        filename: 'app.js',
        path: outputDir,
        // publicPath: '/public/',
    },
    watch: watch,
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', getStylesheetLoader()),
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
        new ExtractTextPlugin(production ? 'app.min.css' : 'app.css'),
    ],
};

if (production) {
    webpackConfig.plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }));

    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
    }));

    webpackConfig.output.filename = 'app.min.js';
}

module.exports = webpackConfig;
