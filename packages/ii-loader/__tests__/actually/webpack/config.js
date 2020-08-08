const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
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
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: path.resolve(__dirname, './postcss.config.js'),
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                includePaths: [path.resolve(__dirname, '../scss')],
                            },
                        },
                    },
                    {
                        loader: path.resolve(__dirname, '../../../dist/index.js'),
                        options: {
                            path: path.resolve(__dirname, '../img'),
                            resolvePath: '/img',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [new MiniCssExtractPlugin({ filename: '[name]' })],
};
