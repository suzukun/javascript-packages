module.exports.getJestConfig = () => `const baseConfig = require('../../config/jest.config.base.json');
const { name } = require('./package');

module.exports = {
    ...baseConfig,
    name,
    displayName: name,
    rootDir: '../..',
    testMatch: [\`<rootDir>/packages/\${name}/__tests__/**/*.test.{js,ts}\`],
};
`;
