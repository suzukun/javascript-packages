const { merge } = require('webpack-merge');
const baseConfig = require('../../config/webpack.config.base');

module.exports = merge(baseConfig, {
    output: {
        library: 'ii-loader',
        libraryExport: 'default',
        libraryTarget: 'umd',
    },
});
