const baseConfig = require('../../config/typedoc.base.json');
const { name } = require('./package');

module.exports = {
    ...baseConfig,
    name,
    out: `../../docs/${name}`,
};
