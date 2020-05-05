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
    plugins: [
        new webpack.BannerPlugin({ banner: banner, raw: true, entryOnly: true }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.exec\.js$/,
                use: ['script-loader']
            }
        ]
    }
};