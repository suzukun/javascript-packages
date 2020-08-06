const base = require("../../jest.config.base");
const pack = require("./package");

module.exports = {
  ...base,
  displayName: pack.name,
  name: pack.name,
  rootDir: "../..",
  testMatch: [`<rootDir>/packages/${pack.name}/__test__/*.spec.{js,ts}`],
};
