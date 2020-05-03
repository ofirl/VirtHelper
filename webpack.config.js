const path = require('path');
const webpack = require('webpack');
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const banner = `// ==UserScript==
// @name     VirtHelper
// @version  1
// @grant    none
// @include  http*://virtonomics.com/*
// ==/UserScript==`;

module.exports = {
    entry: './src/virtHelper.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'virtHelperDist.js'
    },
    // optimization: {
    //     minimizer: [
    //         new UglifyJsPlugin({
    //             uglifyOptions: {
    //                 output: {
    //                     beautify: false,
    //                     preamble: banner,
    //                 },
    //             },
    //         }),
    //     ],
    // },
    plugins: [
        new webpack.BannerPlugin({ banner: banner, raw: true, entryOnly: true })
    ],
};