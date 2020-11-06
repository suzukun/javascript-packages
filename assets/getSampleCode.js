const { toCamelCase } = require("./utils/toCamelCase");

module.exports.getSampleCode = (name) => `export const ${toCamelCase(name)} = () => {
    console.log('${name}.');
};
`;
