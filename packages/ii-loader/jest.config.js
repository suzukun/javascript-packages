const base = require('../../config/jest.config.base');
const { name } = require('./package');

module.exports = {
    ...base,
    name,
    displayName: name,
    rootDir: '../..',
    testMatch: [`<rootDir>/packages/${name}/__tests__/**/*.test.{js,ts}`],
};
