const { merge } = require('webpack-merge');
const baseConfig = require('../../config/webpack.config.base');
const browserBaseConfig = require('../../config/webpack.config.browser.base');

module.exports = merge(baseConfig, browserBaseConfig, {});
