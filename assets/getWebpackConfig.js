module.exports.getWebpackConfig = () => `const { merge } = require('webpack-merge');
const baseConfig = require('../../config/webpack.config.base');

module.exports = merge(baseConfig, {});
`;
