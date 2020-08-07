const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');

module.exports = {
    mode: "production",
    entry: "./index.ts",
    output: {
        filename: "index.js",
        path: path.resolve("./dist"),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        minimizer: [
            new TerserWebpackPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                },
            }),
        ],
    },
    resolve: {
        extensions: [".js", ".ts", '.json', '*'],
    },
    plugins: [new WebpackBar(), new CleanWebpackPlugin()],
};
