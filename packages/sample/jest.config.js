const base = require("../../config/jest.config.base");
const pack = require("./package");

module.exports = {
  ...base,
  displayName: pack.name,
  name: pack.name,
  rootDir: "../..",
  testMatch: [`<rootDir>/packages/${pack.name}/__tests__/**/*.test.{js,ts}`],
};
