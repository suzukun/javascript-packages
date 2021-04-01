const baseConfig = require('../../config/typedoc.base.json');
const { name } = require('./package');

module.exports = {
    ...baseConfig,
    name,
    entryPoints: ['./src/index.ts'],
    out: `../../docs/${name}`,
};
