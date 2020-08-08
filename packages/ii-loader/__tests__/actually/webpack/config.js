const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        'css/style.css': path.resolve(__dirname, '../scss/style.scss'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name]',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                config: {
                                    path: path.resolve(__dirname, 'postcss.config.js'),
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: [path.resolve(__dirname, '../scss')],
                            },
                        },
                        {
                            loader: './dist/index.js',
                            options: {
                                path: path.resolve(__dirname, '../img'),
                                resolvePath: '/img',
                            },
                        },
                    ],
                }),
            },
        ],
    },
    plugins: [new ExtractTextWebpackPlugin('[name]')],
};
