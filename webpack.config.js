const path = require('path');
const webpack = require('webpack');

/**
 * # Webpack Build Process for Data Lasso
 *
 * Available arguments:
 *
 * --production
 * Removes JS and CSS source maps from the output; Sets up `NODE_ENV` variable to`production`.
 *
 */

const production = process.argv.includes('-p');

let webpackConfig = {
    entry: {
        app: path.join(__dirname, 'src/index.js'),
        vendor: ['backbone-model', 'lodash', 'three', 'three-orbit-controls', 'invariant', 'stats.js', 'tween-functions'],
    },
    output: {
        filename: 'app.js',
        path: path.join(__dirname, 'public/build'),
    },
    watch: !production,
    module: {
        loaders: [
            {
                test: /\.glsl$/,
                loader: 'shader',
            },
        ],
    },
    resolve: {
        root: [
            path.resolve('./src/app/lib'),
        ],
    },
    devtool: production ? '' : 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'public'),
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js',
            minChunks: Infinity,
        }),
    ],
};

if (production) {
    webpackConfig.plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }));

    // Below needs transpilation to ES5 in order to work

    // webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //         warnings: false,
    //     },
    // }));

    // webpackConfig.output.filename = 'app.min.js';
}

module.exports = webpackConfig;
